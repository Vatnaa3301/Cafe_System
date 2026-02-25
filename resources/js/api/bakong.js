import client from './client';

/**
 * Generate a KHQR string + Bakong deeplink short URL.
 * @param {{ amount: number, currency: 'USD'|'KHR' }} data
 */
export const generateQR = (data) =>
    client.post('/bakong/generate-qr', data).then((r) => r.data);

/**
 * Poll Bakong for the transaction status identified by the QR md5 hash.
 * @param {{ md5: string }} data
 */
export const checkPayment = (data) =>
    client.post('/bakong/check-payment', data).then((r) => r.data);
