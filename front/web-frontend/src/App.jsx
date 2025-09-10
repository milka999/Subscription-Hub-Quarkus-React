import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Header from './components/layout/Header';
import Statistics from './components/dashboard/Statistics';
import FilterBar from './components/dashboard/FilterBar';
import SubscriptionGrid from './components/subscriptions/SubscriptionGrid';
import SubscriptionList from './components/subscriptions/SubscriptionList';
import AddSubscriptionModal from './components/modals/AddSubscriptionModal';
import LoadingSpinner from './components/common/LoadingSpinner';
import EmptyState from './components/common/EmptyState';
import { subscriptionService, statisticsService } from './services/api';
import './App.css';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [view, setView] = useState('grid');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    loadData();
  }, [filter]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subsData, statsData] = await Promise.all([
        subscriptionService.getSubscriptions(filter === 'ALL' ? null : filter),
        statisticsService.getUserStatistics()
      ]);
      setSubscriptions(subsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await subscriptionService.updateStatus(id, status);
      await loadData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await subscriptionService.deleteSubscription(id);
        await loadData();
      } catch (error) {
        console.error('Failed to delete subscription:', error);
      }
    }
  };

  const handleAdd = async (data) => {
    try {
      await subscriptionService.createSubscription(data);
      await loadData();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add subscription:', error);
      throw error;
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider value={{ darkMode, setDarkMode }}>
      <SubscriptionProvider value={{ subscriptions: filteredSubscriptions, loadData }}>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onAddClick={() => setIsAddModalOpen(true)}
            />

            {statistics && <Statistics statistics={statistics} />}

            <FilterBar
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              view={view}
              setView={setView}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
              {loading ? (
                <LoadingSpinner />
              ) : filteredSubscriptions.length === 0 ? (
                <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
              ) : view === 'grid' ? (
                <SubscriptionGrid
                  subscriptions={filteredSubscriptions}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ) : (
                <SubscriptionList
                  subscriptions={filteredSubscriptions}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              )}
            </div>

            <AddSubscriptionModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAdd}
            />
          </div>
        </div>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;