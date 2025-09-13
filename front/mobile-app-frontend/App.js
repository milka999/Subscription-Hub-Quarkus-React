import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme, MD3DarkTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SubscriptionsScreen from './src/screens/SubscriptionsScreen';
import AddSubscriptionScreen from './src/screens/AddSubscriptionScreen';
import SubscriptionDetailScreen from './src/screens/SubscriptionDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProvidersScreen from './src/screens/ProvidersScreen';

// Contexts
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1',
    accent: '#764ba2',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6366f1',
    accent: '#764ba2',
  },
};

function SubscriptionsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="SubscriptionsList"
        component={SubscriptionsScreen}
        options={{ title: 'My Subscriptions' }}
      />
      <Stack.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetailScreen}
        options={{ title: 'Subscription Details' }}
      />
      <Stack.Screen
        name="AddSubscription"
        component={AddSubscriptionScreen}
        options={{ title: 'Add Subscription' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Subscriptions') {
            iconName = focused ? 'credit-card' : 'credit-card-outline';
          } else if (route.name === 'Providers') {
            iconName = focused ? 'domain' : 'domain';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Subscriptions" component={SubscriptionsStack} />
      <Tab.Screen name="Providers" component={ProvidersScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      setIsDarkMode(theme === 'dark');
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <ThemeProvider value={{ isDarkMode, toggleTheme }}>
        <AuthProvider>
          <NavigationContainer>
            <MainTabs />
          </NavigationContainer>
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}