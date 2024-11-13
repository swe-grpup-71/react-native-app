import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const initializeUserId = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync("userId");
        console.log('Fetched userId:', storedUserId);
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error fetching userId:', error);
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    };
  
    initializeUserId();
  }, []);
  
  // Run this effect only if userId is not null
  useEffect(() => {
    if (isLoading) {
      return; // Don't run until loading is complete
    }
    if (!userId) {
      return; // Skip if userId is not yet available
    }
  
    console.log("userId is available:", userId); // Add this for debugging
  
    const checkFirstLoginAndTriggerAPI = async () => {
      const isFirstLogin = await SecureStore.getItemAsync("isFirstLogin");
  
      if (isFirstLogin === "true") {
        try {
          const response = await fetch("https://buzztracker-backend.youkushaders-1.workers.dev/inbox/create-messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
  
          if (response.ok) {
            console.log("API triggered for first login.");
            // Clear the flag after the first call
            await SecureStore.setItemAsync("isFirstLogin", "false");
          } else {
            const errorText = await response.text();
            console.error("API call failed:", errorText);
            Alert.alert("Error", `Failed to create messages: ${errorText}`);
          }
        } catch (error) {
          console.error("Error during API call:", error);
          Alert.alert("Error", "Unable to connect to the server.");
        }
      }
    };
  
    checkFirstLoginAndTriggerAPI();
  }, [userId, isLoading]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {console.log('No userId available');return;}

      try {
        const response = await fetch(`https://buzztracker-backend.youkushaders-1.workers.dev/inbox/get-messages?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        if (data.status && data.data) {
          setNotifications(data.data);
        } else {
          Alert.alert('Error', 'Failed to load notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Error', 'An error occurred while fetching notifications');
      }
    };

    fetchNotifications();
  }, [userId]);

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
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
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
      ) : !isLoading && (
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
  loadingText: {
    fontSize: 20,
    color: '#999',
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
