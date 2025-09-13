import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const EmptyState = ({ message, onAction, actionLabel }) => {
  return (
    <View style={styles.container}>
      <Icon name="inbox" size={64} color="#ccc" />
      <Text style={styles.message}>{message}</Text>
      {onAction && (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel || 'Take Action'}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});

export default EmptyState;