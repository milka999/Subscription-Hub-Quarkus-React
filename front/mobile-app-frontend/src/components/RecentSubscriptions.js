import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Chip, useTheme } from 'react-native-paper';
import moment from 'moment';

const RecentSubscriptions = ({ subscriptions, onPress }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '#10b981';
      case 'CANCELLED':
        return '#ef4444';
      case 'ON_HOLD':
        return '#f59e0b';
      case 'EXPIRED':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent subscriptions</Text>
      </View>
    );
  }

  return (
    <View>
      {subscriptions.map((subscription) => (
        <TouchableOpacity
          key={subscription.id}
          onPress={() => onPress(subscription)}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.leftContent}>
                <Title style={styles.title}>{subscription.name}</Title>
                <Text style={styles.price}>${subscription.price}/mo</Text>
              </View>
              <View style={styles.rightContent}>
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(subscription.status) + '20' },
                  ]}
                  textStyle={{
                    color: getStatusColor(subscription.status),
                    fontSize: 11,
                  }}
                >
                  {subscription.status}
                </Chip>
                <Text style={styles.dueDate}>
                  Due: {moment(subscription.dueDate).format('MMM DD')}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderRadius: 10,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusChip: {
    height: 24,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default RecentSubscriptions;