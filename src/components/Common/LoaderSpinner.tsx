import React from 'react';
import { LoadingSpinner } from '../ui';

const LoaderSpinner = () => {
    return (
         <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-base">Loading...</span>
              </div>
            </div>
    );
};

export default LoaderSpinner;