import React, { useState } from 'react';
import { Play, Pause, X, Trash2 } from 'lucide-react';
import { getStatusColor, formatCurrency, formatDate } from '../../utils/helpers';

const SubscriptionCard = ({ subscription, onStatusChange, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusChange(subscription.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subscription.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {subscription.description}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Price:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(subscription.price)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Billing:</span>
          <span className="font-medium text-gray-900 dark:text-white capitalize">
            {subscription.billingCycle?.toLowerCase()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Due Date:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatDate(subscription.dueDate)}
          </span>
        </div>
        {subscription.provider && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Provider:</span>
            <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
              {subscription.provider.serviceName}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {subscription.status !== 'ACTIVE' && (
          <button
            onClick={() => handleStatusChange('ACTIVE')}
            disabled={isUpdating}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <Play size={16} />
            Activate
          </button>
        )}
        {subscription.status === 'ACTIVE' && (
          <button
            onClick={() => handleStatusChange('ON_HOLD')}
            disabled={isUpdating}
            className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <Pause size={16} />
            Hold
          </button>
        )}
        {subscription.status !== 'CANCELLED' && (
          <button
            onClick={() => handleStatusChange('CANCELLED')}
            disabled={isUpdating}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <X size={16} />
            Cancel
          </button>
        )}
        <button
          onClick={() => onDelete(subscription.id)}
          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          aria-label="Delete subscription"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;