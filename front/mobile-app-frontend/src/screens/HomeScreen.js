import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

import { statisticsService, subscriptionService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import RecentSubscriptions from '../components/RecentSubscriptions';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState(null);
  const [recentSubscriptions, setRecentSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [statsData, subsData] = await Promise.all([
        statisticsService.getUserStatistics(),
        subscriptionService.getSubscriptions('ACTIVE'),
      ]);
      setStatistics(statsData);
      setRecentSubscriptions(subsData.slice(0, 3));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header with gradient */}
      <LinearGradient
        colors={['#6366f1', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Title style={styles.headerTitle}>Welcome Back!</Title>
          <Paragraph style={styles.headerSubtitle}>
            Manage your subscriptions efficiently
          </Paragraph>
        </View>
      </LinearGradient>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Monthly"
          value={`$${statistics?.totalForThisMonth || 0}`}
          icon="cash"
          color="#10b981"
        />
        <StatCard
          title="Active Subs"
          value={recentSubscriptions.length}
          icon="check-circle"
          color="#6366f1"
        />
        <StatCard
          title="Avg. Monthly"
          value={`$${statistics?.averageMonthlyPayments || 0}`}
          icon="trending-up"
          color="#f59e0b"
        />
        <StatCard
          title="Over Limit"
          value={`$${statistics?.amountOverMonthlyLimit || 0}`}
          icon="alert-circle"
          color="#ef4444"
        />
      </View>

      {/* Quick Actions */}
      <Surface style={styles.quickActions}>
        <Title style={styles.sectionTitle}>Quick Actions</Title>
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('Subscriptions', {
              screen: 'AddSubscription'
            })}
            style={styles.actionButton}
          >
            Add New
          </Button>
          <Button
            mode="outlined"
            icon="view-list"
            onPress={() => navigation.navigate('Subscriptions')}
            style={styles.actionButton}
          >
            View All
          </Button>
        </View>
      </Surface>

      {/* Recent Subscriptions */}
      <Surface style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Recent Subscriptions</Title>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Subscriptions')}
          >
            See All
          </Button>
        </View>
        <RecentSubscriptions
          subscriptions={recentSubscriptions}
          onPress={(item) =>
            navigation.navigate('Subscriptions', {
              screen: 'SubscriptionDetail',
              params: { subscription: item },
            })
          }
        />
      </Surface>

      {/* Monthly Summary */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Monthly Summary</Title>
          <View style={styles.summaryRow}>
            <Text>Most Expensive:</Text>
            <Text style={styles.summaryValue}>
              ${statistics?.mostExpensiveSubscription || 0}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Payments:</Text>
            <Text style={styles.summaryValue}>
              ${statistics?.totalPayments || 0}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -20,
  },
  quickActions: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  recentSection: {
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryCard: {
    margin: 15,
    marginBottom: 30,
    borderRadius: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  summaryValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;