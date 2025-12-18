import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-sky-200 border-opacity-25 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-t-sky-500 rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};
