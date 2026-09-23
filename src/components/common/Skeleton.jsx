import React from 'react';

// Animated placeholder rows for table view while data is loading
export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx}>
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 8 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div className="skeleton" style={{ width: '70%', height: 16 }} />
                <div className="skeleton" style={{ width: '40%', height: 12 }} />
              </div>
            </div>
          </td>
          <td>
            <div className="skeleton" style={{ width: 80, height: 22, borderRadius: 999 }} />
          </td>
          <td>
            <div className="skeleton" style={{ width: 60, height: 16 }} />
          </td>
          <td>
            <div className="skeleton" style={{ width: 45, height: 16 }} />
          </td>
          <td>
            <div className="skeleton" style={{ width: 90, height: 22, borderRadius: 999 }} />
          </td>
          <td>
            <div style={{ display: 'flex', gap: 6 }}>
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

// Animated placeholder cards for grid/mobile view while data is loading
export const CardsSkeleton = ({ count = 6 }) => {
  return (
    <div className="mobile-cards-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="mobile-card">
          <div className="mobile-card-header">
            <div className="skeleton" style={{ width: 60, height: 60, borderRadius: 8 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="skeleton" style={{ width: '80%', height: 16 }} />
              <div className="skeleton" style={{ width: '45%', height: 12 }} />
              <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 999 }} />
            </div>
          </div>
          <div className="mobile-card-body">
            <div className="skeleton" style={{ width: 60, height: 16 }} />
            <div className="skeleton" style={{ width: 70, height: 18, borderRadius: 999 }} />
          </div>
          <div className="mobile-card-actions">
            <div className="skeleton" style={{ flex: 1, height: 32, borderRadius: 6 }} />
            <div className="skeleton" style={{ flex: 1, height: 32, borderRadius: 6 }} />
            <div className="skeleton" style={{ flex: 1, height: 32, borderRadius: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default { TableSkeleton, CardsSkeleton };
