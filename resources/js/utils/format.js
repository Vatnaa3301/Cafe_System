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
