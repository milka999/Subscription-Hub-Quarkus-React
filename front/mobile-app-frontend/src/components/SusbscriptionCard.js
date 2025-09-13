import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  IconButton,
  Menu,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import moment from 'moment';

const SubscriptionCard = ({ subscription, onPress, onStatusChange, onDelete }) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

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

  const handleDelete = () => {
    Alert.alert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(subscription.id),
        },
      ]
    );
  };

  const formatBillingCycle = (cycle) => {
    if (!cycle) return '';
    return cycle.charAt(0) + cycle.slice(1).toLowerCase();
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
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
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            {subscription.status !== 'ACTIVE' && (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onStatusChange(subscription.id, 'ACTIVE');
                }}
                title="Activate"
                leadingIcon="play"
              />
            )}
            {subscription.status === 'ACTIVE' && (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onStatusChange(subscription.id, 'ON_HOLD');
                }}
                title="Put on Hold"
                leadingIcon="pause"
              />
            )}
            {subscription.status !== 'CANCELLED' && (
              <Menu.Item
                onPress={() => {
                  setMenuVisible(false);
                  onStatusChange(subscription.id, 'CANCELLED');
                }}
                title="Cancel"
                leadingIcon="close"
              />
            )}
            <Divider />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleDelete();
              }}
              title="Delete"
              leadingIcon="delete"
              titleStyle={{ color: theme.colors.error }}
            />
          </Menu>
        </View>

        <Paragraph style={styles.description} numberOfLines={2}>
          {subscription.description}
        </Paragraph>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Price:</Text>
            <Text style={styles.detailValue}>${subscription.price}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Billing:</Text>
            <Text style={styles.detailValue}>
              {formatBillingCycle(subscription.billingCycle)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due:</Text>
            <Text style={styles.detailValue}>
              {subscription.dueDate
                ? moment(subscription.dueDate).format('MMM DD, YYYY')
                : 'N/A'}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusChip: {
    alignSelf: 'flex-start',
    height: 28,
  },
  description: {
    marginTop: 10,
    marginBottom: 15,
    color: '#666',
  },
  details: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  detailValue: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SubscriptionCard;