import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  List,
  useTheme,
  Text,
} from 'react-native-paper';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { subscriptionService } from '../services/api';

const SubscriptionDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { subscription: initialSubscription } = route.params;
  const [subscription, setSubscription] = useState(initialSubscription);
  const [loading, setLoading] = useState(false);

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

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await subscriptionService.updateStatus(subscription.id, newStatus);
      setSubscription({ ...subscription, status: newStatus });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update status',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await subscriptionService.deleteSubscription(subscription.id);
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Subscription deleted',
              });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete subscription',
              });
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <Title style={styles.title}>{subscription.name}</Title>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor(subscription.status) + '20' },
                ]}
                textStyle={{ color: getStatusColor(subscription.status) }}
              >
                {subscription.status}
              </Chip>
            </View>
            <Paragraph style={styles.description}>{subscription.description}</Paragraph>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Subscription Details</Title>
          <List.Item
            title="Price"
            description={`${subscription.price}`}
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
          />
          <List.Item
            title="Billing Cycle"
            description={subscription.billingCycle}
            left={(props) => <List.Icon {...props} icon="refresh" />}
          />
          <List.Item
            title="Start Date"
            description={moment(subscription.startedAt).format('MMMM DD, YYYY')}
            left={(props) => <List.Icon {...props} icon="calendar-start" />}
          />
          <List.Item
            title="Due Date"
            description={moment(subscription.dueDate).format('MMMM DD, YYYY')}
            left={(props) => <List.Icon {...props} icon="calendar-clock" />}
          />
          {subscription.provider && (
            <List.Item
              title="Provider"
              description={subscription.provider.serviceName}
              left={(props) => <List.Icon {...props} icon="domain" />}
            />
          )}
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Actions</Title>
          <View style={styles.actionButtons}>
            {subscription.status !== 'ACTIVE' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('ACTIVE')}
                loading={loading}
                style={[styles.actionButton, { backgroundColor: '#10b981' }]}
                icon="play"
              >
                Activate
              </Button>
            )}
            {subscription.status === 'ACTIVE' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('ON_HOLD')}
                loading={loading}
                style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
                icon="pause"
              >
                Put on Hold
              </Button>
            )}
            {subscription.status !== 'CANCELLED' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('CANCELLED')}
                loading={loading}
                style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
                icon="close"
              >
                Cancel
              </Button>
            )}
          </View>
          <Divider style={styles.divider} />
          <Button
            mode="outlined"
            onPress={handleDelete}
            style={styles.deleteButton}
            icon="delete"
            textColor={theme.colors.error}
          >
            Delete Subscription
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 10,
    borderRadius: 10,
  },
  headerContent: {
    paddingVertical: 10,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 30,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  detailsCard: {
    margin: 10,
    borderRadius: 10,
  },
  actionsCard: {
    margin: 10,
    marginBottom: 30,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionButtons: {
    gap: 10,
  },
  actionButton: {
    marginVertical: 5,
  },
  divider: {
    marginVertical: 15,
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
});

export default SubscriptionDetailScreen;