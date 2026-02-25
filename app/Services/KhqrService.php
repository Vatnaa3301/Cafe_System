<?php

namespace App\Services;

class KhqrService
{
    /**
     * Build a TLV (Tag-Length-Value) element for EMVCo QR.
     * Format: TT LL VALUE  (tag 2 chars, length 2 chars zero-padded, value)
     */
    private function tlv(string $tag, string $value): string
    {
        return $tag . str_pad(strlen($value), 2, '0', STR_PAD_LEFT) . $value;
    }

    /**
     * CRC-16/CCITT (CRC-16-IBM-SDLC / X.25)
     * Polynomial : 0x1021
     * Init value : 0xFFFF
     * No reflection, XOR out: 0x0000
     */
    private function crc16(string $data): string
    {
        $crc = 0xFFFF;
        for ($i = 0, $len = strlen($data); $i < $len; $i++) {
            $crc ^= (ord($data[$i]) << 8);
            for ($j = 0; $j < 8; $j++) {
                if ($crc & 0x8000) {
                    $crc = (($crc << 1) ^ 0x1021) & 0xFFFF;
                } else {
                    $crc = ($crc << 1) & 0xFFFF;
                }
            }
        }
        return strtoupper(sprintf('%04X', $crc));
    }

    /**
     * Generate a KHQR (EMVCo QR) string for Bakong.
     *
     * @param float  $amount    Transaction amount
     * @param string $currency  'USD' or 'KHR'
     * @param string $reference Short reference label (max 25 chars)
     */
    public function generateQrString(float $amount, string $currency, string $reference): string
    {
        $currencyCode = ($currency === 'USD') ? '840' : '116';

        // USD: 2 decimal places; KHR: whole number (0 decimals)
        $amountStr = ($currency === 'USD')
            ? number_format($amount, 2, '.', '')
            : (string) (int) round($amount);

        $accountId    = config('services.bakong.account_id');
        $merchantName = mb_substr(config('services.bakong.merchant_name'), 0, 25);
        $merchantCity = mb_substr(config('services.bakong.merchant_city'), 0, 15);

        // Tag 29 — Merchant Account Information (Bakong KHQR format)
        // Sub-tag 00 holds the Bakong account ID
        $merchantAccountContent = $this->tlv('00', $accountId);
        $merchantAccount        = $this->tlv('29', $merchantAccountContent);

        // Tag 62 — Additional Data Field Template
        // Sub-tag 05 = Reference Label
        $additionalDataContent = $this->tlv('05', mb_substr($reference, 0, 25));
        $additionalData        = $this->tlv('62', $additionalDataContent);

        // Assemble QR (without CRC value, but WITH the "6304" CRC prefix)
        $qr  = $this->tlv('00', '01');           // Payload format indicator
        $qr .= $this->tlv('01', '12');           // Point of initiation: dynamic
        $qr .= $merchantAccount;                  // Merchant account
        $qr .= $this->tlv('52', '5999');         // MCC: general merchandise
        $qr .= $this->tlv('53', $currencyCode);  // Transaction currency
        $qr .= $this->tlv('54', $amountStr);     // Transaction amount
        $qr .= $this->tlv('58', 'KH');           // Country code
        $qr .= $this->tlv('59', $merchantName);  // Merchant name
        $qr .= $this->tlv('60', $merchantCity);  // Merchant city
        $qr .= $additionalData;                   // Additional data
        $qr .= '6304';                            // CRC tag + length placeholder

        // CRC is calculated over everything including the "6304" placeholder
        $crc = $this->crc16($qr);

        return $qr . $crc;
    }
}
