import React from 'react';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({ onAddClick }) => {
  return (
    <div className="text-center py-12">
      <Inbox className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={64} />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No subscriptions found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Get started by adding your first subscription
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg"
      >
        <Plus size={20} />
        Add Your First Subscription
      </button>
    </div>
  );
};

export default EmptyState;