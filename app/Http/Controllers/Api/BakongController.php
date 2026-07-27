<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\KhqrService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class BakongController extends Controller
{
    public function __construct(private KhqrService $khqr) {}

    /**
     * POST /api/bakong/generate-qr
     * Generate a KHQR string and obtain a Bakong short-link deeplink.
     */
    public function generateQr(Request $request)
    {
        $data = $request->validate([
            'amount'   => 'required|numeric|min:0.01',
            'currency' => 'required|in:USD,KHR',
        ]);

        // Unique order reference for this QR session
        $reference = 'CAFE-' . strtoupper(substr(md5(uniqid('', true)), 0, 8));

        $qrString = $this->khqr->generateQrString(
            (float) $data['amount'],
            $data['currency'],
            $reference
        );

        $md5 = md5($qrString);

        Log::info('KHQR Generated', [
            'amount'    => $data['amount'],
            'currency'  => $data['currency'],
            'reference' => $reference,
            'qr'        => $qrString,
            'md5'       => $md5,
        ]);

        // Call Bakong API to get deep-link
        $shortLink = null;
        try {
            $resp = Http::timeout(15)
                ->withoutVerifying()   // bypass SSL cert issues on local/dev
                ->acceptJson()
                ->withHeaders([
                    'Authorization' => 'Bearer ' . config('services.bakong.api_token'),
                ])
                ->post(
                    config('services.bakong.api_url') . '/v1/generate_deeplink_by_qr',
                    [
                        'qr'         => $qrString,
                        'sourceInfo' => [
                            'appIconUrl'          => config('app.url') . '/favicon.ico',
                            'appName'             => config('app.name'),
                            'appDeepLinkCallback' => config('app.url'),
                        ],
                    ]
                );

            $body      = $resp->json();
            $shortLink = $body['data']['shortLink'] ?? null;

            if ($shortLink === null) {
                Log::warning('Bakong deeplink not returned', [
                    'reference' => $reference,
                    'md5'       => $md5,
                    'currency'  => $data['currency'],
                    'amount'    => $data['amount'],
                    'response'  => $body,
                ]);
            }
        } catch (\Exception) {
            // Deeplink is optional – QR still works for direct scanning
            Log::warning('Bakong deeplink request failed', [
                'reference' => $reference,
                'md5'       => $md5,
                'currency'  => $data['currency'],
                'amount'    => $data['amount'],
            ]);
        }

        return response()->json([
            'qrString'  => $qrString,
            'shortLink' => $shortLink,
            'md5'       => $md5,
            'reference' => $reference,
        ]);
    }

    /**
     * POST /api/bakong/check-payment
     * Poll Bakong for the status of a transaction identified by the QR md5.
     */
    public function checkPayment(Request $request)
    {
        $data = $request->validate([
            'md5' => 'required|string|max:255',
        ]);

        try {
            $resp = Http::timeout(15)
                ->withoutVerifying()   // bypass SSL cert issues on local/dev
                ->withHeaders([
                    'Authorization' => 'Bearer ' . config('services.bakong.api_token'),
                    'Content-Type'  => 'application/json',
                ])
                ->post(
                    config('services.bakong.api_url') . '/v1/check_transaction_by_md5',
                    ['md5' => $data['md5']]
                );

            // Forward Bakong's response (responseCode 0 = success, 1 = not yet / failed)
            return response()->json($resp->json());
        } catch (\Exception $e) {
            // Return a Bakong-shaped response so the frontend keeps polling gracefully
            return response()->json([
                'responseCode'    => 1,
                'responseMessage' => 'Connection error: ' . $e->getMessage(),
                'data'            => null,
                'errorCode'       => 9,
            ]);  // 200 so frontend does not throw and stops polling
        }
    }
}
