import React, { useContext, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Card,
  Title,
  List,
  Switch,
  Button,
  useTheme,
  TextInput,
  Divider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../contexts/ThemeContext';
import { userService } from '../services/api';
import Toast from 'react-native-toast-message';

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(true);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateLimit = async () => {
    if (!monthlyLimit || parseFloat(monthlyLimit) <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Amount',
        text2: 'Please enter a valid monthly limit',
      });
      return;
    }

    setLoading(true);
    try {
      await userService.updateMonthlyLimit(parseFloat(monthlyLimit));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Monthly limit updated',
      });
      setMonthlyLimit('');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update monthly limit',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'All data cleared',
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Appearance</Title>
          <List.Item
            title="Dark Mode"
            description="Toggle dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch value={isDarkMode} onValueChange={toggleTheme} />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Notifications</Title>
          <List.Item
            title="Push Notifications"
            description="Receive alerts for due dates"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Budget</Title>
          <TextInput
            label="Monthly Limit ($)"
            value={monthlyLimit}
            onChangeText={setMonthlyLimit}
            mode="outlined"
            keyboardType="decimal-pad"
            left={<TextInput.Affix text="$" />}
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleUpdateLimit}
            loading={loading}
            style={styles.button}
          >
            Update Limit
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Data & Privacy</Title>
          <List.Item
            title="Clear Cache"
            description="Remove all cached data"
            left={(props) => <List.Icon {...props} icon="delete-sweep" />}
            onPress={handleClearData}
          />
          <Divider />
          <List.Item
            title="Export Data"
            description="Download your data as CSV"
            left={(props) => <List.Icon {...props} icon="download" />}
            onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Coming Soon',
                text2: 'Export feature will be available soon',
              });
            }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>About</Title>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Developer"
            description="SubHub Team"
            left={(props) => <List.Icon {...props} icon="code-tags" />}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default SettingsScreen;