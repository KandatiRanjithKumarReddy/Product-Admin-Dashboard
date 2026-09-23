import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import productsApi from '../../api/productsApi';
import { useProductsState } from '../../context/ProductsContext';

// Modal popup for asking the user to confirm before deleting a product
export const DeleteConfirmModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { recordDeletedProduct } = useProductsState();

  if (!product) return null;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    setError('');

    try {
      // Send delete request to the API
      await productsApi.deleteProduct(product.id);
      recordDeletedProduct(product.id, product.title);
      onSuccess(product.id);
      onClose();
    } catch (err) {
      console.error('Delete product failed', err);
      // If it's a locally added product, remove it locally
      if (String(product.id).startsWith('custom-')) {
        recordDeletedProduct(product.id, product.title);
        onSuccess(product.id);
        onClose();
      } else {
        setError(err.message || 'Failed to delete product. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isDeleting) onClose();
      }}
      title="Delete Product"
      maxWidth="460px"
    >
      <div className="modal-body">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              Confirm Product Deletion
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Are you sure you want to delete <strong>"{product.title}"</strong>? This will remove the item from the catalog.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--danger-text)', background: 'var(--danger-bg)', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.825rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="modal-footer">
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          isLoading={isDeleting}
          disabled={isDeleting}
        >
          Delete Product
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
