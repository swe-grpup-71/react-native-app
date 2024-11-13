import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await SecureStore.getItemAsync("userId");
      console.log('Fetched userId:', userId);
      setUserId(userId as string);

      if (userId) {
        try {
          const response = await fetch(`https://buzztracker-backend.youkushaders-1.workers.dev/inbox/get-messages?userId=${userId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });
          const data = await response.json();
          // console.log('Parsed data:', data);
          if (data.status && data.data) {
            setNotifications(data.data);
            // console.log('Notifications:', data.data);
          } else {
            Alert.alert('Error', 'Failed to load notifications');
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
          Alert.alert('Error', 'An error occurred while fetching notifications');
        }
      }
    };

    fetchUserId();
  }, []);

  const handleDeleteNotification = (id: string) => {
    // Mark the notification as deleted in the state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.messageId === id
          ? { ...notification, isDeleted: true }
          : notification
      )
    );

    console.log(`Notification with ID: ${id} marked as deleted`);
  };

  return (
    <View style={styles.container}>
      {notifications.length > 0 ? (
        <ScrollView>
          {notifications
            .filter((notification) => !notification.isDeleted) // Filter out notifications marked as deleted
            .map((notification) => (
              <View key={notification.messageId} style={styles.notificationCard}>
                <MaterialIcons name="notifications" size={24} color="#7b4b52" style={styles.icon} />
                <Text style={styles.message}>{notification.message}</Text>
                <TouchableOpacity onPress={() => handleDeleteNotification(notification.messageId)} style={styles.deleteIcon}>
                  <MaterialIcons name="close" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
      ) : (
        <Text style={styles.noNotificationsText}>No notifications at the moment.</Text>
      )}
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
    justifyContent: 'space-between',
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
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  deleteIcon: {
    marginLeft: 10,
  },
  noNotificationsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
});
