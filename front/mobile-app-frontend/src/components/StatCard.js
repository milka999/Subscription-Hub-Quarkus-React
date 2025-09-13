import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginVertical: 5,
    borderRadius: 10,
  },
  content: {
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default StatCard;