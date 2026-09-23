import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';
import Badge from '../common/Badge';
import { formatCurrency, getStockStatus, PLACEHOLDER_IMAGE } from '../../utils/formatters';

// Grid view of products — shown on smaller screens or when grid layout is selected
export const ProductCards = ({ products, onEdit, onDelete }) => {
  return (
    <div className="mobile-cards-grid">
      {products.map((product) => {
        const stockInfo = getStockStatus(product.stock);
        const imageSrc = product.thumbnail || product.images?.[0] || PLACEHOLDER_IMAGE;

        return (
          <div key={product.id} className="mobile-card">
            {/* Product image, title, and rating */}
            <div className="mobile-card-header">
              <img
                src={imageSrc}
                alt={product.title}
                className="mobile-card-thumb"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="mobile-card-meta">
                <Link to={`/products/${product.id}`} className="product-title-link">
                  <h4 className="mobile-card-title">{product.title}</h4>
                </Link>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <Badge variant="neutral">
                    {product.category ? product.category.replace(/-/g, ' ') : 'General'}
                  </Badge>
                  <div className="rating-pill">
                    <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and stock tag */}
            <div className="mobile-card-body">
              <span className="price-text" style={{ fontSize: '1.05rem' }}>
                {formatCurrency(product.price)}
              </span>
              <Badge variant={stockInfo.variant}>{stockInfo.label}</Badge>
            </div>

            {/* Action buttons (View, Edit, Delete) */}
            <div className="mobile-card-actions">
              <Link to={`/products/${product.id}`} className="btn btn-secondary btn-sm">
                <Eye size={14} /> View
              </Link>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onEdit(product)}
              >
                <Edit3 size={14} /> Edit
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger-text)' }}
                onClick={() => onDelete(product)}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCards;
