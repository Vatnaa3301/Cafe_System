<?php

namespace App\Services;

use KHQR\BakongKHQR;
use KHQR\Helpers\KHQRData;
use KHQR\Models\IndividualInfo;

class KhqrService
{
    /**
     * Generate a KHQR (EMVCo QR) string for Bakong.
     *
     * This uses the official `khqr-gateway/bakong-khqr-php` SDK to ensure the
     * payload structure (including Timestamp tag `99`) matches what bank apps
     * validate. If the payload is missing required fields, apps can show errors
     * like "QR is expired".
     *
     * @param float  $amount    Transaction amount
     * @param string $currency  'USD' or 'KHR'
     * @param string $reference Unused in QR payload (kept for API compatibility). Correlation is via md5 poll.
     */
    public function generateQrString(float $amount, string $currency, string $reference): string
    {
        $accountId = (string) config('services.bakong.account_id');
        // SDK README: minimal Individual KHQR uses only bakongAccountID in tag 29 (no subtag 01).
        // Forcing a default GUI here caused ABA to reject scans as MAPP-KHQR-INV-FORMAT.
        $gui = config('services.bakong.gui');
        $accountInformation = (is_string($gui) && $gui !== '') ? $gui : null;
        $merchantName = mb_substr((string) config('services.bakong.merchant_name'), 0, 25);
        $merchantCity = mb_substr((string) config('services.bakong.merchant_city'), 0, 15);

        $currencyCode = ($currency === 'USD') ? KHQRData::CURRENCY_USD : KHQRData::CURRENCY_KHR;

        // Do not put order reference in tag 62 (terminalLabel). The official minimal sample has no tag 62;
        // ABA Scan often returns MAPP-KHQR-INV-FORMAT when tag 62 content does not match their rules.

        $info = new IndividualInfo(
            $accountId,
            $merchantName,
            $merchantCity,
            null, // acquiringBank
            $accountInformation, // optional GUI / accountInformation (omit unless provider requires)
            $currencyCode,
            $amount,
            null, // billNumber
            null, // storeLabel
            null, // terminalLabel
            null, // mobileNumber
            null, // purposeOfTransaction
            null, // languagePreference
            null, // merchantNameAlternateLanguage
            null, // merchantCityAlternateLanguage
            null, // upiMerchantAccount
        );

        $result = BakongKHQR::generateIndividual($info);

        // $result->data is ['qr' => string, 'md5' => string]
        $qr = (string) ($result->data['qr'] ?? '');
        if ($qr === '') {
            throw new \RuntimeException('KHQR SDK returned an empty QR string');
        }

        return $qr;
    }
}
