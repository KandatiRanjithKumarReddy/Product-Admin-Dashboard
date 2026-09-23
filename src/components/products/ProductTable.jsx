import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';
import Badge from '../common/Badge';
import { formatCurrency, getStockStatus, PLACEHOLDER_IMAGE } from '../../utils/formatters';

// Main products table view — displays thumbnails, categories, prices, ratings, and action buttons
export const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '35%' }}>Product</th>
            <th style={{ width: '15%' }}>Category</th>
            <th style={{ width: '12%' }}>Price</th>
            <th style={{ width: '12%' }}>Rating</th>
            <th style={{ width: '14%' }}>Stock</th>
            <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockInfo = getStockStatus(product.stock);
            const imageSrc = product.thumbnail || product.images?.[0] || PLACEHOLDER_IMAGE;

            return (
              <tr key={product.id}>
                {/* Image and title */}
                <td>
                  <div className="product-cell">
                    <img
                      src={imageSrc}
                      alt={product.title}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <Link to={`/products/${product.id}`} className="product-title-link">
                        {product.title}
                      </Link>
                      <div className="product-sub-info">
                        {product.brand ? `${product.brand} • ` : ''}
                        SKU: {product.sku || `PRD-${product.id}`}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td>
                  <Badge variant="neutral">
                    {product.category ? product.category.replace(/-/g, ' ') : 'General'}
                  </Badge>
                </td>

                {/* Price */}
                <td>
                  <span className="price-text">{formatCurrency(product.price)}</span>
                </td>

                {/* Rating */}
                <td>
                  <div className="rating-pill">
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </td>

                {/* Stock status */}
                <td>
                  <Badge variant={stockInfo.variant}>{stockInfo.label}</Badge>
                </td>

                {/* View, Edit, and Delete action buttons */}
                <td>
                  <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-secondary btn-icon"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      title="Edit Product"
                      onClick={() => onEdit(product)}
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      style={{ color: 'var(--danger-text)' }}
                      title="Delete Product"
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
