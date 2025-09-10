import React, { useState } from 'react';
import { Play, Pause, X, Trash2 } from 'lucide-react';
import { getStatusColor, formatCurrency, formatDate } from '../../utils/helpers';

const SubscriptionListItem = ({ subscription, onStatusChange, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    await onStatusChange(subscription.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscription.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subscription.description}
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Price:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {formatCurrency(subscription.price)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Billing:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                {subscription.billingCycle?.toLowerCase()}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Due:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {formatDate(subscription.dueDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {subscription.status !== 'ACTIVE' && (
            <button
              onClick={() => handleStatusChange('ACTIVE')}
              disabled={isUpdating}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
              aria-label="Activate subscription"
            >
              <Play size={16} />
            </button>
          )}
          {subscription.status === 'ACTIVE' && (
            <button
              onClick={() => handleStatusChange('ON_HOLD')}
              disabled={isUpdating}
              className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50"
              aria-label="Put subscription on hold"
            >
              <Pause size={16} />
            </button>
          )}
          {subscription.status !== 'CANCELLED' && (
            <button
              onClick={() => handleStatusChange('CANCELLED')}
              disabled={isUpdating}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
              aria-label="Cancel subscription"
            >
              <X size={16} />
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
    </div>
  );
};

export default SubscriptionListItem;