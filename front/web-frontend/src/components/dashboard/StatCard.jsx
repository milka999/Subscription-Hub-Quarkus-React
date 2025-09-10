import React from 'react';

const StatCard = ({ icon: Icon, title, value, color, bgColor, prefix = '', suffix = '' }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>
            {prefix}{typeof value === 'number' ? value.toFixed(2) : value}{suffix}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={color} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;