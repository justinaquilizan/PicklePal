import React from "react";

const FloatingActionButton = ({ onClick, icon, label, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center group ${className}`}
      title={label}>
      <span className="text-2xl">{icon}</span>

      {/* Tooltip */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {label}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>
    </button>
  );
};

export default FloatingActionButton;
