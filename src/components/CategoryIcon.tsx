import React from "react";

interface CategoryIconProps {
  icon: string;
  className?: string;
  size?: number;
}

function isUrl(value: string): boolean {
  return /^(https?:|data:|\/)/.test(value);
}

function isMaterialSymbol(value: string): boolean {
  return /^[a-z0-9_]+$/.test(value);
}

const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  className = "text-lg",
  size = 20,
}) => {
  if (!icon) return null;

  if (isUrl(icon)) {
    return (
      <img
        src={icon}
        alt=""
        className={`inline-block rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (isMaterialSymbol(icon)) {
    return (
      <span
        className={`material-symbols-outlined inline-flex items-center leading-none ${className}`}
        style={{ fontSize: size, width: size, height: size }}
      >
        {icon}
      </span>
    );
  }

  return <span className={className}>{icon}</span>;
};

export default CategoryIcon;