import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  FAB,
  Searchbar,
  Chip,
  useTheme,
  Portal,
  Modal,
  List,
  Button,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { subscriptionService } from '../services/api';
import SubscriptionCard from '../components/SubscriptionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const SubscriptionsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  const filters = ['ALL', 'ACTIVE', 'CANCELLED', 'ON_HOLD', 'EXPIRED'];

  useFocusEffect(
    useCallback(() => {
      loadSubscriptions();
    }, [selectedFilter])
  );

  useEffect(() => {
    filterAndSortSubscriptions();
  }, [subscriptions, searchQuery, selectedFilter, sortBy]);

  const loadSubscriptions = async () => {
    try {
      const data = await subscriptionService.getSubscriptions(
        selectedFilter === 'ALL' ? null : selectedFilter
      );
      setSubscriptions(data);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load subscriptions',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAndSortSubscriptions = () => {
    let filtered = [...subscriptions];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return 0;
      }
    });

    setFilteredSubscriptions(filtered);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await subscriptionService.updateStatus(id, newStatus);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Status updated successfully',
      });
      loadSubscriptions();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update status',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await subscriptionService.deleteSubscription(id);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Subscription deleted',
      });
      loadSubscriptions();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete subscription',
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSubscriptions();
  };

  const renderSubscription = ({ item }) => (
    <SubscriptionCard
      subscription={item}
      onPress={() =>
        navigation.navigate('SubscriptionDetail', { subscription: item })
      }
      onStatusChange={handleStatusChange}
      onDelete={handleDelete}
    />
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search subscriptions..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilter === item}
              onPress={() => setSelectedFilter(item)}
              style={styles.filterChip}
              mode={selectedFilter === item ? 'flat' : 'outlined'}
            >
              {item.replace('_', ' ')}
            </Chip>
          )}
        />
        <Button
          icon="sort"
          mode="text"
          onPress={() => setSortModalVisible(true)}
          style={styles.sortButton}
        >
          Sort
        </Button>
      </View>

      {/* Subscriptions List */}
      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          message="No subscriptions found"
          onAction={() => navigation.navigate('AddSubscription')}
          actionLabel="Add Subscription"
        />
      ) : (
        <FlatList
          data={filteredSubscriptions}
          renderItem={renderSubscription}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* FAB */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddSubscription')}
      />

      {/* Sort Modal */}
      <Portal>
        <Modal
          visible={sortModalVisible}
          onDismiss={() => setSortModalVisible(false)}
          contentContainerStyle={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <List.Section>
            <List.Subheader>Sort By</List.Subheader>
            <List.Item
              title="Name"
              left={(props) => <List.Icon {...props} icon="sort-alphabetical-ascending" />}
              onPress={() => {
                setSortBy('name');
                setSortModalVisible(false);
              }}
              right={() => sortBy === 'name' && <List.Icon icon="check" />}
            />
            <List.Item
              title="Price"
              left={(props) => <List.Icon {...props} icon="currency-usd" />}
              onPress={() => {
                setSortBy('price');
                setSortModalVisible(false);
              }}
              right={() => sortBy === 'price' && <List.Icon icon="check" />}
            />
            <List.Item
              title="Due Date"
              left={(props) => <List.Icon {...props} icon="calendar" />}
              onPress={() => {
                setSortBy('dueDate');
                setSortModalVisible(false);
              }}
              right={() => sortBy === 'dueDate' && <List.Icon icon="check" />}
            />
          </List.Section>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 10,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  filterChip: {
    marginHorizontal: 5,
  },
  sortButton: {
    marginLeft: 'auto',
  },
  listContainer: {
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
});

export default SubscriptionsScreen;