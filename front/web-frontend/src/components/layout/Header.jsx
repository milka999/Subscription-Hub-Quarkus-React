import React from 'react';
import { CreditCard, Plus, Sun, Moon } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, onAddClick }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CreditCard className="text-white" size={32} />
            <h1 className="text-3xl font-bold text-white">SubHub</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:text-gray-200 transition-colors p-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button
              onClick={onAddClick}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 shadow-md"
            >
              <Plus size={20} />
              Add Subscription
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;