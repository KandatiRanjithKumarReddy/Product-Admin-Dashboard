import apiClient from './client';

export const productsApi = {
  // Get a page of products, with optional sorting and simulated delay
  async getProducts({ limit = 10, skip = 0, sortBy, order, delay, signal } = {}) {
    const params = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await apiClient.get('/products', { params, signal });
    return response.data;
  },

  // Search products by keyword
  async searchProducts({ q, limit = 10, skip = 0, sortBy, order, delay, signal } = {}) {
    const params = { q, limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await apiClient.get('/products/search', { params, signal });
    return response.data;
  },

  // Get the full list of product categories
  async getCategories({ signal } = {}) {
    const response = await apiClient.get('/products/categories', { signal });
    const data = response.data;

    // Normalize each category into a consistent { slug, name } shape
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === 'string') {
          return {
            slug: item,
            name: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' '),
          };
        }
        return { slug: item.slug, name: item.name };
      });
    }
    return [];
  },

  // Get products that belong to a specific category
  async getProductsByCategory({ category, limit = 10, skip = 0, sortBy, order, delay, signal } = {}) {
    const params = { limit, skip };
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (delay) params.delay = delay;

    const response = await apiClient.get(`/products/category/${encodeURIComponent(category)}`, {
      params,
      signal,
    });
    return response.data;
  },

  // Get one product by its ID
  async getProductById(id, { signal } = {}) {
    const response = await apiClient.get(`/products/${id}`, { signal });
    return response.data;
  },

  // Create a new product (DummyJSON simulates this — it won't persist)
  async addProduct(productData) {
    const response = await apiClient.post('/products/add', productData);
    return response.data;
  },

  // Update an existing product
  async updateProduct(id, productData) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete a product
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

export default productsApi;
