import React from 'react';
import SubscriptionCard from './SubscriptionCard';

const SubscriptionGrid = ({ subscriptions, onStatusChange, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {subscriptions.map(subscription => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SubscriptionGrid;