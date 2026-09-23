import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, RefreshCw, PackageX } from 'lucide-react';
import useProductFilters from '../hooks/useProductFilters';
import productsApi from '../api/productsApi';
import { useProductsState } from '../context/ProductsContext';
import ProductTable from '../components/products/ProductTable';
import ProductCards from '../components/products/ProductCards';
import ProductFilters from '../components/products/ProductFilters';
import Pagination from '../components/products/Pagination';
import ProductFormModal from '../components/products/ProductFormModal';
import DeleteConfirmModal from '../components/products/DeleteConfirmModal';
import { TableSkeleton, CardsSkeleton } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';

// Main products dashboard page — manages listing, searching, filtering, pagination, and modal dialogs
export const ProductsPage = () => {
  const { filters, setPage, setLimit, setSearch, setCategory, setSort, setDelay, resetFilters } =
    useProductFilters();

  const { overrides, mergeProducts } = useProductsState();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal dialog state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Keep track of active requests to prevent older slow responses from overwriting newer ones
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const currentReqId = ++requestIdRef.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    const { page, limit, q, category, sortBy, order, delay } = filters;
    const skip = (page - 1) * limit;

    try {
      let data;

      // Handle simultaneous search + category filter
      if (q && category) {
        const searchRes = await productsApi.searchProducts({
          q,
          limit: 100,
          skip: 0,
          sortBy,
          order,
          delay: delay ? Number(delay) : undefined,
          signal: controller.signal,
        });

        // Filter search results by selected category
        const filtered = (searchRes.products || []).filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );

        data = {
          products: filtered.slice(skip, skip + limit),
          total: filtered.length,
          skip,
          limit,
        };
      } else if (q) {
        // Search query only
        data = await productsApi.searchProducts({
          q,
          limit,
          skip,
          sortBy,
          order,
          delay: delay ? Number(delay) : undefined,
          signal: controller.signal,
        });
      } else if (category) {
        // Category filter only
        data = await productsApi.getProductsByCategory({
          category,
          limit,
          skip,
          sortBy,
          order,
          delay: delay ? Number(delay) : undefined,
          signal: controller.signal,
        });
      } else {
        // Standard paginated list
        data = await productsApi.getProducts({
          limit,
          skip,
          sortBy,
          order,
          delay: delay ? Number(delay) : undefined,
          signal: controller.signal,
        });
      }

      // Check if this request is still the newest one
      if (currentReqId === requestIdRef.current) {
        // Merge API products with local edits/deletes
        const merged = mergeProducts(data.products || []);

        // On first page, include locally created products at the top
        let finalList = merged;
        if (page === 1 && overrides.created.length > 0) {
          const matchingCreated = overrides.created.filter((p) => {
            if (category && p.category?.toLowerCase() !== category.toLowerCase()) return false;
            if (q && !p.title?.toLowerCase().includes(q.toLowerCase())) return false;
            return true;
          });
          const existingIds = new Set(merged.map((m) => m.id));
          const newToAdd = matchingCreated.filter((c) => !existingIds.has(c.id));
          finalList = [...newToAdd, ...merged];
        }

        setProducts(finalList);
        setTotalProducts(data.total + (page === 1 ? overrides.created.length : 0));
        setIsLoading(false);
      }
    } catch (err) {
      if (err.isCanceled || controller.signal.aborted) {
        return;
      }
      if (currentReqId === requestIdRef.current) {
        setError(err.message || 'Failed to fetch products');
        setIsLoading(false);
      }
    }
  }, [filters, overrides, mergeProducts]);

  useEffect(() => {
    fetchProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSuccess = () => {
    fetchProducts();
  };

  const handleDeleteSuccess = () => {
    fetchProducts();
  };

  return (
    <div>
      {/* Header section with page title and action buttons */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Management</h1>
          <p className="page-subtitle">
            Manage your inventory, search, filter, and modify product records
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() => fetchProducts()}
            disabled={isLoading}
            title="Refresh product list"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filter and search controls bar */}
      <ProductFilters
        filters={filters}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onDelayChange={setDelay}
        onReset={resetFilters}
      />

      {/* Main product catalog listing or error state */}
      {error ? (
        <ErrorState
          title="Could not load products"
          message={error}
          onRetry={fetchProducts}
        />
      ) : (
        <div className="surface-card">
          {isLoading ? (
            <>
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
                    <TableSkeleton rows={filters.limit} />
                  </tbody>
                </table>
              </div>
              <CardsSkeleton count={Math.min(filters.limit, 6)} />
            </>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="state-icon-box">
                <PackageX size={32} color="var(--text-muted)" />
              </div>
              <h3 className="state-title">No products found</h3>
              <p className="state-desc">
                {filters.q || filters.category
                  ? 'No products matched your search or category filters. Try clearing your search or choosing a different category.'
                  : 'There are currently no products available.'}
              </p>
              {(filters.q || filters.category) && (
                <Button variant="secondary" onClick={resetFilters} style={{ marginTop: '0.5rem' }}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Table view for desktop screens */}
              <ProductTable
                products={products}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />

              {/* Card grid view for mobile screens */}
              <div style={{ padding: '1rem' }} className="mobile-only-container">
                <ProductCards
                  products={products}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              </div>

              {/* Pagination controls */}
              <Pagination
                currentPage={filters.page}
                pageSize={filters.limit}
                totalItems={totalProducts}
                onPageChange={setPage}
                onPageSizeChange={setLimit}
              />
            </>
          )}
        </div>
      )}

      {/* Popup modal for adding or editing products */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={editingProduct}
        onSuccess={handleFormSuccess}
      />

      {/* Delete confirmation popup modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={deletingProduct}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default ProductsPage;
