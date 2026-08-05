import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  borderRadius = '0.75rem',
}) => {
  const style: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? '1rem',
    borderRadius,
  };

  return (
    <div
      className={`inline-block skeleton-shimmer ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
