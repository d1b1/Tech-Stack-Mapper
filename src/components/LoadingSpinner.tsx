import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <img
        src="https://cdn.lowcodecto.com/logos/logo.png"
        alt="Loading..."
        className="w-16 h-16 animate-spin-slow"
        style={{ animationDuration: '3s' }}
      />
    </div>
  );
};

export default LoadingSpinner;
