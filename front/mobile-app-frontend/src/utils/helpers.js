import moment from 'moment';

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return `${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return moment(dateString).format('MMM DD, YYYY');
};

export const getStatusColor = (status) => {
  const colors = {
    ACTIVE: '#10b981',
    CANCELLED: '#ef4444',
    ON_HOLD: '#f59e0b',
    EXPIRED: '#6b7280',
  };
  return colors[status] || '#6b7280';
};

export const calculateMonthlyAmount = (price, billingCycle) => {
  const multipliers = {
    DAILY: 30,
    WEEKLY: 4.33,
    BIWEEKLY: 2.17,
    MONTHLY: 1,
    YEARLY: 1 / 12,
  };
  return price * (multipliers[billingCycle] || 1);
};

export const getDaysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const today = moment();
  const due = moment(dueDate);
  return due.diff(today, 'days');
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};