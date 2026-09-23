import React from 'react';

// Small colored label — used for categories, stock status, etc.
export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  return <span className={`badge badge-${variant} ${className}`.trim()}>{children}</span>;
};

export default Badge;
