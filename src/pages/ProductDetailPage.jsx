import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Calendar,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import productsApi from '../api/productsApi';
import { useProductsState } from '../context/ProductsContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProductFormModal from '../components/products/ProductFormModal';
import { formatCurrency, getStockStatus, PLACEHOLDER_IMAGE } from '../utils/formatters';

// Product detail page — displays image gallery, specs, price, stock status, and customer reviews
export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductFromOverrides } = useProductsState();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch product details when the ID changes
  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setIsNotFound(false);
    setErrorMessage('');

    // Check if item was locally deleted or created
    const override = getProductFromOverrides(id);
    if (override?.isDeleted) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    if (override && String(id).startsWith('custom-')) {
      setProduct(override);
      const initialImg = override.thumbnail || override.images?.[0] || PLACEHOLDER_IMAGE;
      setSelectedImage(initialImg);
      setIsLoading(false);
      return;
    }

    productsApi
      .getProductById(id, { signal: controller.signal })
      .then((data) => {
        const merged = override ? { ...data, ...override } : data;
        setProduct(merged);
        const initialImg = merged.images?.[0] || merged.thumbnail || PLACEHOLDER_IMAGE;
        setSelectedImage(initialImg);
      })
      .catch((err) => {
        if (!err.isCanceled && !controller.signal.aborted) {
          if (err.status === 404 || err.message?.toLowerCase().includes('not found')) {
            setIsNotFound(true);
          } else {
            setErrorMessage(err.message || 'Failed to load product details.');
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [id, getProductFromOverrides]);

  // Loading skeleton screen
  if (isLoading) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div className="skeleton" style={{ width: 140, height: 36, marginBottom: '2rem', borderRadius: 8 }} />
        <div className="detail-grid">
          <div className="skeleton" style={{ aspectRatio: '4/3', borderRadius: 16 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="skeleton" style={{ width: '40%', height: 24, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: '80%', height: 36, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: '30%', height: 32, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: '100%', height: 90, borderRadius: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  // Not found screen for invalid product IDs
  if (isNotFound) {
    return (
      <div className="surface-card" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '2rem' }}>
        <div className="state-icon-box" style={{ margin: '0 auto 1rem', background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
          <AlertCircle size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          404 - Product Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 1.5rem' }}>
          We could not find a product with ID <strong>"{id}"</strong>. It may have been removed or the link might be incorrect.
        </p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Products Catalog
        </Link>
      </div>
    );
  }

  // Error message screen
  if (errorMessage) {
    return (
      <div className="surface-card" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '2rem' }}>
        <div className="state-icon-box" style={{ margin: '0 auto 1rem', background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
          <AlertCircle size={32} />
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Error Loading Product
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 1.5rem' }}>
          {errorMessage}
        </p>
        <Link to="/products" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const stockInfo = getStockStatus(product.stock);
  const images = product.images && product.images.length > 0
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [PLACEHOLDER_IMAGE];

  return (
    <div>
      {/* Back button and Edit action button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ gap: 6 }}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <Button
          variant="secondary"
          size="sm"
          icon={Edit3}
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Product
        </Button>
      </div>

      {/* Main product gallery and information layout */}
      <div className="detail-grid">
        {/* Product image gallery */}
        <div className="gallery-container">
          <div className="main-image-box">
            <img
              src={selectedImage}
              alt={product.title}
              className="main-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          {images.length > 1 && (
            <div className="thumbnail-row">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumb-btn ${selectedImage === imgUrl ? 'active' : ''}`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="thumb-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details, price, and specs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <Badge variant="neutral">
              {product.category ? product.category.toUpperCase().replace(/-/g, ' ') : 'GENERAL'}
            </Badge>
            {product.brand && (
              <Badge variant="info">
                {product.brand}
              </Badge>
            )}
            <Badge variant={stockInfo.variant}>
              {stockInfo.label}
            </Badge>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem' }}>
            {product.title}
          </h1>

          {/* Rating and review count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="rating-pill" style={{ fontSize: '0.95rem' }}>
              <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
              <span>{Number(product.rating || 0).toFixed(1)}</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>•</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {product.reviews?.length || 0} Customer Reviews
            </span>
          </div>

          {/* Price display */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.85rem',
            }}
          >
            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--brand-400)' }}>
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage && (
              <Badge variant="success">
                {product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Description
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {product.description}
            </p>
          </div>

          {/* Specifications table */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Product Specifications
          </h3>
          <table className="detail-specs-table">
            <tbody>
              <tr>
                <td>SKU</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{product.sku || `PRD-${product.id}`}</td>
              </tr>
              {product.dimensions && (
                <tr>
                  <td>Dimensions</td>
                  <td>
                    {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D cm
                  </td>
                </tr>
              )}
              {product.weight && (
                <tr>
                  <td>Weight</td>
                  <td>{product.weight} kg</td>
                </tr>
              )}
              {product.warrantyInformation && (
                <tr>
                  <td>Warranty</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={16} color="var(--success-text)" />
                    {product.warrantyInformation}
                  </td>
                </tr>
              )}
              {product.shippingInformation && (
                <tr>
                  <td>Shipping</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Truck size={16} color="var(--info-text)" />
                    {product.shippingInformation}
                  </td>
                </tr>
              )}
              {product.returnPolicy && (
                <tr>
                  <td>Return Policy</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <RotateCcw size={16} color="var(--brand-400)" />
                    {product.returnPolicy}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="reviews-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Customer Reviews</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Feedback from verified purchasers
            </p>
          </div>
          <Badge variant="neutral">
            {product.reviews?.length || 0} Total Reviews
          </Badge>
        </div>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="reviews-grid">
            {product.reviews.map((rev, index) => (
              <div key={index} className="review-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rev.reviewerName}</span>
                  <div className="rating-pill">
                    <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  "{rev.comment}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Calendar size={12} />
                  <span>{new Date(rev.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{rev.reviewerEmail}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No reviews yet for this product.
          </div>
        )}
      </section>

      {/* Edit product popup modal */}
      <ProductFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={product}
        onSuccess={(updated) => {
          setProduct(updated);
        }}
      />
    </div>
  );
};

export default ProductDetailPage;
