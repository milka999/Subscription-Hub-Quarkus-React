import { createContext, useContext } from 'react';

export const SubscriptionContext = createContext({
  subscriptions: [],
  loadData: () => {}
});

export const SubscriptionProvider = SubscriptionContext.Provider;

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};