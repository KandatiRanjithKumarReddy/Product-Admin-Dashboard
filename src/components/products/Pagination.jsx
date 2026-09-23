import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Pagination controls — page number buttons, previous/next buttons, and items per page selector
export const Pagination = ({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Calculate product range to show (e.g. 1-10 of 100)
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Create array of page numbers to render with dots for gaps
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (safeCurrentPage > 3) {
        pages.push('ellipsis-start');
      }

      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (safeCurrentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination-container">
      {/* Current item range count */}
      <div className="pagination-info">
        Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{totalItems}</strong> products
      </div>

      {/* Page navigation buttons */}
      <div className="pagination-controls">
        <button
          type="button"
          className="page-btn"
          disabled={safeCurrentPage <= 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          aria-label="Previous Page"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, idx) => {
          if (typeof p === 'string') {
            return (
              <span key={`ellipsis-${idx}`} className="page-ellipsis">
                …
              </span>
            );
          }

          const isActive = p === safeCurrentPage;
          return (
            <button
              key={p}
              type="button"
              className={`page-btn ${isActive ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={isActive ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          className="page-btn"
          disabled={safeCurrentPage >= totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          aria-label="Next Page"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Items per page dropdown */}
      <div className="page-size-selector">
        <label htmlFor="pageSizeSelect">Show</label>
        <select
          id="pageSizeSelect"
          className="form-select"
          style={{ padding: '0.35rem 1.75rem 0.35rem 0.65rem', fontSize: '0.8rem' }}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
