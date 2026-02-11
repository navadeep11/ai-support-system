export function extractOrderId(text) {
    const match = text.match(/ORD-\d+/i);
    return match ? match[0].toUpperCase() : null;
}
export function extractInvoiceId(text) {
    const match = text.match(/INV-\d+/i);
    return match ? match[0].toUpperCase() : null;
}
