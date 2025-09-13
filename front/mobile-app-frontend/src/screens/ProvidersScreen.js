import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  useTheme,
  Chip,
} from 'react-native-paper';
import { providerService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProvidersScreen = ({ navigation }) => {
  const theme = useTheme();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadProviders();
  }, [searchQuery]);

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await providerService.getServiceProviders(searchQuery, page, 20);
      setProviders(data.content || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProvider = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.providerName}>{item.name}</Title>
        <Paragraph style={styles.email}>{item.contactEmail}</Paragraph>
        {item.websiteUrl && (
          <Chip icon="web" style={styles.websiteChip}>
            {item.websiteUrl}
          </Chip>
        )}
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() =>
            navigation.navigate('Subscriptions', {
              screen: 'AddSubscription',
              params: { providerId: item.id },
            })
          }
        >
          Add Subscription
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Searchbar
        placeholder="Search providers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {providers.length === 0 ? (
        <EmptyState
          message="No providers found"
          actionLabel="Refresh"
          onAction={loadProviders}
        />
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  websiteChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});

export default ProvidersScreen;