import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
}) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-lg shadow-md overflow-hidden",
        className
      )}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};
