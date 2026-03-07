/**
 * KHR exchange rate: 1 USD → KHR.
 * Update this value to keep it current.
 */
export const KHR_RATE = 4000;

/**
 * Convert a USD amount to KHR (whole number).
 * @param {number} usd
 * @returns {number}
 */
export function usdToKhr(usd) {
    return Math.round((usd ?? 0) * KHR_RATE);
}

/**
 * Format a KHR amount as a readable string (e.g. "22,550 ៛").
 * @param {number} khr  - amount already in KHR (whole riel)
 * @returns {string}
 */
export function formatKHR(khr) {
    return `${Math.round(khr ?? 0).toLocaleString('en-US')} ៛`;
}

/**
 * Format a number as US Dollar (USD).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style                : 'currency',
        currency             : 'USD',
        minimumFractionDigits: 2,
    }).format(amount ?? 0);
}

// Alias kept for convenience
export const formatUSD = formatCurrency;

/**
 * Format a date string to a readable local string.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year  : 'numeric',
        month : 'short',
        day   : 'numeric',
    });
}
