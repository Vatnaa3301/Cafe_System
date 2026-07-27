# Bakong QR Error Report

Date: 2026-03-25
Project: Cafe_System

## Problem Summary
The cashier checkout generates a QR code, but payment apps do not complete consistently:

- ABA app shows: Invalid QR code (MAPP-KHQR-INV-FORMAT)
- Acleda app can parse merchant and amount, but payment flow does not complete (account selection/payment completion issue)

This means the QR is generated and readable in part, but stricter validation or account/routing policy blocks final acceptance in some apps.

## Key Symptoms Observed
1. Initial error looked like QR expired/invalid.
2. One intermediate test produced Thai QR interpretation (fixed by restoring Bakong GUI).
3. Latest state: ABA still rejects as KHQR invalid format; Acleda partially accepts.
4. Personal bank-app generated receive QR for the same account works.

## Likely Cause
Most likely this is a bank/provider policy-validation mismatch, not a basic frontend bug:

- KHQR validators in bank apps appear stricter than before.
- Merchant-presented dynamic KHQR can require fields and profile flags not required by personal receive QR.
- Account-level enablement/routing for merchant KHQR may differ by bank app/network.

## What Was Changed In Code
The following updates were implemented during troubleshooting.

### 1) Switched QR generation to official Bakong KHQR SDK
File: app/Services/KhqrService.php

- Removed custom manual TLV/CRC generator.
- Integrated official PHP SDK generation via KHQR\\BakongKHQR and IndividualInfo.
- Keeps app API contract unchanged (controller/frontend still call the same service method).

Why: reduce breakage from spec drift and app validator updates.

### 2) Added and adjusted Bakong config options
File: config/services.php

- Added/used Bakong options:
  - gui
  - point_initiation_method
  - qr_expire_seconds

### 3) Updated environment values used by KHQR
File: .env

- BAKONG_GUI=kh.gov.nbc.bakong
- BAKONG_POINT_INIT_METHOD=12
- BAKONG_QR_EXPIRE_SECONDS=300

### 4) Reference formatting adjustment
File: app/Http/Controllers/Api/BakongController.php

- Reference string was simplified to alphanumeric format for compatibility testing.

### 5) Frontend retry amount consistency fix
File: resources/js/components/cashier/QRPaymentModal.jsx

- Retry path now uses the same currency-normalized amount path as initial generation.

### 6) Runtime cache refresh
Command executed after updates:

- php artisan optimize:clear

## Current Technical Conclusion
After moving to official SDK generation, the app still sees cross-app inconsistency:

- ABA remains strict and rejects.
- Acleda parses but cannot complete payment.

This strongly indicates account/profile/routing policy rather than only payload syntax.

## Why Personal QR Works But App QR Fails
A personal receive QR and a merchant-presented dynamic checkout QR are not always treated the same by bank validators.

Differences may include:

- account profile flags
- merchant acceptance/routing policy
- dynamic amount and timestamp policy
- cross-bank acceptance configuration

## Immediate Next Steps
1. Confirm account profile with bank/provider
- Ask whether pin_vatana@bkrt is enabled for merchant-presented dynamic KHQR acceptance across ABA and Acleda rails.

2. Confirm Bakong API token/account registration status
- Ensure the API token and account owner mapping are valid for merchant checkout use case.

3. Capture provider-side evidence
- Add temporary backend logs for generate_deeplink_by_qr and check_transaction_by_md5 responses.
- Record responseCode, errorCode, responseMessage, md5, and timestamp for one failed scan.

4. Send support ticket with evidence
- Include exact app errors:
  - MAPP-KHQR-INV-FORMAT (ABA)
  - Acleda parse-but-cannot-complete behavior
- Include one generated QR string and md5 from the same attempt.

## Suggested Support Message Template
Subject: KHQR generated via Bakong API rejected by ABA (format) and not completing in Acleda

Hello Support Team,

We generate merchant-presented KHQR through the Bakong Open API in our POS checkout.

Observed behavior:
- ABA app scan error: MAPP-KHQR-INV-FORMAT
- Acleda app can parse merchant/amount but payment cannot complete.
- Personal bank-app generated receive QR for the same account works.

Account used:
- Bakong account ID: pin_vatana@bkrt

Please verify:
1) Whether this account is enabled for merchant-presented dynamic KHQR acceptance across ABA and Acleda.
2) Whether any recent validation/policy update affects KHQR generated via API.
3) Whether our generated payload/md5 is rejected by any specific rule.

We can provide one sample payload and md5 from a failed attempt on request.

Thank you.

## Security Note
Rotate exposed credentials/tokens if they were shared during troubleshooting.

- Bakong API token
- Telegram bot token

## Status
Code-side improvements are applied and runtime cache has been refreshed.
Remaining blocker appears to be provider/account policy validation.

---

## Validation Update (2026-03-26)

### Additional Investigation Performed
We performed controlled retests with backend logging enabled to determine whether the failure is caused by frontend rendering, KHQR payload structure, or provider/account policy.

#### 1) Added backend diagnostics
File: app/Http/Controllers/Api/BakongController.php

- Added log entries for:
  - KHQR generation mode (STANDARD vs COMPATIBILITY)
  - amount/currency/reference/qr_length/md5
  - Bakong API response status, responseCode, errorCode, responseMessage

#### 2) Tested both QR generation modes
- Compatibility mode test (KHR minimal payload)
- Standard mode test (USD dynamic payload)

Both modes returned the same provider-side error.

### Key Log Evidence (2026-03-26)

Observed in `storage/logs/laravel.log`:

- COMPATIBILITY mode:
  - `response_code: 1`
  - `error_code: 4`
  - message: `Error occured on requesting deeplink from our provider`

- STANDARD mode:
  - `response_code: 1`
  - `error_code: 4`
  - message: `Error occured on requesting deeplink from our provider`

### Acleda Error Code Confirmation

- Acleda scanner message: `QR code is expired [Q0626]`
- Practical interpretation in this flow: bank-side/provider validation did not accept the generated merchant-presented transaction context, and the app surfaces this as expiry/reject behavior.

### Final Technical Conclusion (Updated)

This is not a frontend QR rendering issue.

Evidence now shows:
1. QR image generation is successful.
2. Both generation strategies (standard and compatibility) fail at the same provider step with `error_code: 4`.
3. Personal receive QR still works for the same account, while merchant checkout flow fails.

Most probable blocker: provider/account profile enablement and merchant-routing policy (not local code syntax alone).

### Assignment-Friendly Decision

Given account/bank constraints and non-commercial project scope:
1. Keep current implementation as technical proof-of-integration.
2. Present logs proving provider-side rejection (`error_code: 4`) for both modes.
3. Use this report as evidence that remaining issue is external account/policy validation.

### Support Escalation Addendum

When contacting Bakong/provider, include:
1. account ID: `pin_vatana@bkrt`
2. one failed `md5`
3. timestamp from logs
4. exact provider response:
   - `response_code: 1`
   - `error_code: 4`
   - `Error occured on requesting deeplink from our provider`
5. Acleda scan result: `Q0626`

Request explicit confirmation whether this account is enabled for merchant-presented dynamic KHQR acceptance across partner-bank apps.
