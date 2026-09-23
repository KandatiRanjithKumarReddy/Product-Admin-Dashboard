// Format a number as US dollars (e.g. $49.99)
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Return a label and color variant based on how many items are in stock
export function getStockStatus(stock) {
  const count = Number(stock) || 0;
  if (count <= 0) return { label: 'Out of Stock', variant: 'danger', count: 0 };
  if (count <= 10) return { label: `Low Stock (${count})`, variant: 'warning', count };
  return { label: `In Stock (${count})`, variant: 'success', count };
}

// Fallback image when a product thumbnail can't be loaded
export const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=60';
