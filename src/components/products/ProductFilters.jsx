import React, { useState, useEffect } from 'react';
import { Search, X, Info } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import productsApi from '../../api/productsApi';

// Search box, category dropdown, sort options, and delay filter bar
export const ProductFilters = ({ filters, onSearchChange, onCategoryChange, onSortChange, onDelayChange, onReset }) => {
  const [searchInput, setSearchInput] = useState(filters.q || '');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Wait 400ms after the user stops typing before making the search request
  const debouncedSearch = useDebounce(searchInput, 400);

  // Keep search box in sync if filters change externally (like URL reset or navigation)
  useEffect(() => {
    setSearchInput(filters.q || '');
  }, [filters.q]);

  // Update search filter when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== filters.q) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, filters.q, onSearchChange]);

  // Fetch product categories on load
  useEffect(() => {
    const controller = new AbortController();
    setLoadingCategories(true);

    productsApi
      .getCategories({ signal: controller.signal })
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        if (!err.isCanceled) {
          console.error('Failed to load categories', err);
        }
      })
      .finally(() => {
        setLoadingCategories(false);
      });

    return () => controller.abort();
  }, []);

  const handleClearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  const handleSortSelect = (e) => {
    const val = e.target.value;
    if (!val) {
      onSortChange('', '');
      return;
    }
    const [sortBy, order] = val.split(':');
    onSortChange(sortBy, order);
  };

  const currentSortValue = filters.sortBy ? `${filters.sortBy}:${filters.order || 'asc'}` : '';
  const hasActiveFilters = Boolean(filters.q || filters.category || filters.sortBy || filters.delay);

  return (
    <div className="controls-bar">
      <div className="controls-main-row">
        {/* Search Input Box */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products by title, brand, tag..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="filters-group">
          {/* Category Selector */}
          <select
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={loadingCategories}
            title="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            className="form-select"
            value={currentSortValue}
            onChange={handleSortSelect}
            title="Sort products"
          >
            <option value="">Sort: Default</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="rating:desc">Rating: Highest First</option>
            <option value="title:asc">Title: A to Z</option>
            <option value="title:desc">Title: Z to A</option>
          </select>

          {/* Simulated API Delay Selector */}
          <select
            className="form-select"
            value={filters.delay || ''}
            onChange={(e) => onDelayChange(e.target.value)}
            title="Simulated API Delay for Testing"
          >
            <option value="">Delay: None</option>
            <option value="1000">Delay: 1000ms</option>
            <option value="2000">Delay: 2000ms</option>
            <option value="3000">Delay: 3000ms</option>
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onReset}
              title="Clear all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Info notice when search and category filter are combined */}
      {filters.q && filters.category && (
        <div className="search-filter-notice">
          <Info size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Search + Category Filter:</strong> Searching for "<strong>{filters.q}</strong>" within category "<strong>{filters.category}</strong>".
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
