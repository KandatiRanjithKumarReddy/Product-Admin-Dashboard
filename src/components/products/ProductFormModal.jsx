import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import productsApi from '../../api/productsApi';
import { useProductsState } from '../../context/ProductsContext';

// Modal dialog for adding a new product or editing an existing product
export const ProductFormModal = ({
  isOpen,
  onClose,
  initialData = null,
  onSuccess,
}) => {
  const isEdit = Boolean(initialData);
  const { recordCreatedProduct, recordUpdatedProduct } = useProductsState();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    description: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Fill in form fields when editing an existing product
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        brand: initialData.brand || '',
        description: initialData.description || '',
        thumbnail: initialData.thumbnail || initialData.images?.[0] || '',
      });
    } else {
      setFormData({
        title: '',
        category: '',
        price: '',
        stock: '',
        brand: '',
        description: '',
        thumbnail: '',
      });
    }
    setErrors({});
    setApiError('');
  }, [initialData, isOpen]);

  // Make sure all required fields are valid before sending
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError('');

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      brand: formData.brand.trim() || undefined,
      description: formData.description.trim(),
      thumbnail: formData.thumbnail.trim() || undefined,
    };

    try {
      if (isEdit) {
        // Update product via API
        const res = await productsApi.updateProduct(initialData.id, payload);
        const updated = { ...initialData, ...payload, ...res };
        recordUpdatedProduct(updated);
        onSuccess(updated, 'edit');
      } else {
        // Create product via API
        const res = await productsApi.addProduct(payload);
        const created = { ...payload, ...res, id: res.id || `custom-${Date.now()}` };
        recordCreatedProduct(created);
        onSuccess(created, 'add');
      }
      onClose();
    } catch (err) {
      console.error('Save product failed', err);
      setApiError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isSubmitting) onClose();
      }}
      title={isEdit ? 'Edit Product' : 'Add New Product'}
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          {apiError && (
            <div style={{ color: 'var(--danger-text)', background: 'var(--danger-bg)', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: '0.85rem' }}>
              {apiError}
            </div>
          )}

          {/* Product Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="productTitle">
              Product Title <span className="required">*</span>
            </label>
            <input
              id="productTitle"
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <span className="form-error-msg">{errors.title}</span>}
          </div>

          {/* Category & Brand */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="productCategory">
                Category <span className="required">*</span>
              </label>
              <input
                id="productCategory"
                type="text"
                name="category"
                className="form-input"
                placeholder="e.g. electronics, groceries"
                value={formData.category}
                onChange={handleChange}
              />
              {errors.category && <span className="form-error-msg">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="productBrand">
                Brand
              </label>
              <input
                id="productBrand"
                type="text"
                name="brand"
                className="form-input"
                placeholder="e.g. Sony, Apple"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="productPrice">
                Price ($) <span className="required">*</span>
              </label>
              <input
                id="productPrice"
                type="number"
                step="0.01"
                min="0"
                name="price"
                className="form-input"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <span className="form-error-msg">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="productStock">
                Stock Quantity <span className="required">*</span>
              </label>
              <input
                id="productStock"
                type="number"
                min="0"
                step="1"
                name="stock"
                className="form-input"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
              />
              {errors.stock && <span className="form-error-msg">{errors.stock}</span>}
            </div>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label className="form-label" htmlFor="productThumbnail">
              Thumbnail Image URL
            </label>
            <input
              id="productThumbnail"
              type="url"
              name="thumbnail"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnail}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="productDescription">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="productDescription"
              name="description"
              rows={3}
              className="form-textarea"
              placeholder="Enter product description and specifications..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && <span className="form-error-msg">{errors.description}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
