import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200 dark:border-gray-700"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-indigo-600 border-t-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;