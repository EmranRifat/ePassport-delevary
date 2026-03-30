import React from "react";
import { LoadingSpinner } from "../ui";

const LoaderSpinner = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-base text-gray-900 dark:text-gray-100">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default LoaderSpinner;
