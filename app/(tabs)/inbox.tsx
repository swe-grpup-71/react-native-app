import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

export default function Notifications() {
  const notifications = [
    { id: 1, icon: 'error-outline', message: 'Many cases detected in your area', iconLib: 'MaterialIcons' },
    { id: 2, icon: 'book', message: 'Read the latest news ....', iconLib: 'FontAwesome' },
  ];

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <TouchableOpacity key={notification.id} style={styles.notificationCard}>
          {notification.iconLib === 'MaterialIcons' ? (
            <MaterialIcons name={notification.icon} size={24} color="#7b4b52" style={styles.icon} />
          ) : (
            <FontAwesome name={notification.icon} size={24} color="#7b4b52" style={styles.icon} />
          )}
          <Text style={styles.message}>{notification.message}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
});
