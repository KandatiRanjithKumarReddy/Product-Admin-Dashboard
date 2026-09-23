import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductsContext = createContext(null);

const STORAGE_KEY = 'admin_product_overrides';

export const ProductsProvider = ({ children }) => {
  // Keep track of products we've added, edited, or deleted locally
  // (DummyJSON doesn't actually save changes, so we manage this ourselves)
  const [overrides, setOverrides] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { created: [], updated: {}, deleted: [] };
    } catch {
      return { created: [], updated: {}, deleted: [] };
    }
  });

  const [toasts, setToasts] = useState([]);

  // Save overrides to sessionStorage so they survive page refreshes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.warn('Could not save product changes to sessionStorage', e);
    }
  }, [overrides]);

  // Show a temporary notification at the bottom-right
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Remember a newly created product
  const recordCreatedProduct = (product) => {
    const productWithId = {
      ...product,
      id: product.id || `custom-${Date.now()}`,
      isLocalNew: true,
    };
    setOverrides((prev) => ({
      ...prev,
      created: [productWithId, ...prev.created],
    }));
    showToast(`Product "${product.title}" created successfully!`, 'success');
    return productWithId;
  };

  // Remember that a product was edited
  const recordUpdatedProduct = (product) => {
    setOverrides((prev) => {
      // If it was locally created, update it in the created list
      const isLocallyCreated = prev.created.some((p) => p.id === product.id);
      if (isLocallyCreated) {
        return {
          ...prev,
          created: prev.created.map((p) => (p.id === product.id ? { ...p, ...product } : p)),
        };
      }
      // Otherwise add it to the updated map
      return {
        ...prev,
        updated: {
          ...prev.updated,
          [product.id]: { ...(prev.updated[product.id] || {}), ...product, isLocalEdited: true },
        },
      };
    });
    showToast(`Product "${product.title}" updated successfully!`, 'success');
  };

  // Remember that a product was deleted
  const recordDeletedProduct = (productId, productTitle = 'Product') => {
    setOverrides((prev) => ({
      ...prev,
      created: prev.created.filter((p) => p.id !== productId),
      deleted: [...new Set([...prev.deleted, productId])],
    }));
    showToast(`"${productTitle}" removed successfully!`, 'success');
  };

  // Take API products and apply our local changes on top
  const mergeProducts = (apiProducts = []) => {
    const nonDeleted = apiProducts.filter((p) => !overrides.deleted.includes(p.id));
    const withUpdates = nonDeleted.map((p) =>
      overrides.updated[p.id] ? { ...p, ...overrides.updated[p.id] } : p
    );
    return withUpdates;
  };

  // Look up a product from our local overrides (for detail page use)
  const getProductFromOverrides = (id) => {
    const numId = Number(id);

    if (overrides.deleted.includes(id) || overrides.deleted.includes(numId)) {
      return { isDeleted: true };
    }

    const foundCreated = overrides.created.find((p) => p.id === id || p.id === numId);
    if (foundCreated) return foundCreated;

    if (overrides.updated[id] || overrides.updated[numId]) {
      return overrides.updated[id] || overrides.updated[numId];
    }

    return null;
  };

  const value = {
    overrides,
    toasts,
    showToast,
    removeToast,
    recordCreatedProduct,
    recordUpdatedProduct,
    recordDeletedProduct,
    mergeProducts,
    getProductFromOverrides,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProductsState = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsState must be used within a ProductsProvider');
  }
  return context;
};

export default ProductsContext;
