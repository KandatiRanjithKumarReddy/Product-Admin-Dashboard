import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const VALID_LIMITS = [10, 20, 50];

// Reads filter values (page, search, category, sort, etc.) from the URL
// and provides functions to update them. This keeps the URL as the single source of truth.
export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse all filter values from the current URL, using safe defaults for invalid input
  const filters = useMemo(() => {
    const rawPage = parseInt(searchParams.get('page'), 10);
    const page = !isNaN(rawPage) && rawPage >= 1 ? rawPage : 1;

    const rawLimit = parseInt(searchParams.get('limit'), 10);
    const limit = VALID_LIMITS.includes(rawLimit) ? rawLimit : 10;

    const q = (searchParams.get('q') || '').trim();
    const category = (searchParams.get('category') || '').trim();
    const sortBy = (searchParams.get('sortBy') || '').trim();
    const order = (searchParams.get('order') || 'asc').trim();
    const delay = (searchParams.get('delay') || '').trim();

    return { page, limit, q, category, sortBy, order, delay };
  }, [searchParams]);

  // Update one or more URL params at once, removing empty ones
  const updateParams = useCallback(
    (newParams) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(newParams).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });
        return next;
      }, { replace: false });
    },
    [setSearchParams]
  );

  const setPage = useCallback((page) => updateParams({ page: Math.max(1, page) }), [updateParams]);
  const setLimit = useCallback((limit) => updateParams({ limit, page: 1 }), [updateParams]);
  const setSearch = useCallback((q) => updateParams({ q: q || undefined, page: 1 }), [updateParams]);
  const setCategory = useCallback((category) => updateParams({ category: category || undefined, page: 1 }), [updateParams]);
  const setSort = useCallback(
    (sortBy, order = 'asc') => updateParams({ sortBy: sortBy || undefined, order: sortBy ? order : undefined, page: 1 }),
    [updateParams]
  );
  const setDelay = useCallback((delay) => updateParams({ delay: delay || undefined }), [updateParams]);

  // Clear all filters and go back to page 1
  const resetFilters = useCallback(() => {
    setSearchParams({ page: '1', limit: String(filters.limit) });
  }, [setSearchParams, filters.limit]);

  return { filters, setPage, setLimit, setSearch, setCategory, setSort, setDelay, resetFilters };
}

export default useProductFilters;
