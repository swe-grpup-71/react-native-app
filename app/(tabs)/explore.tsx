import { View, Text, ScrollView, Modal } from "react-native";
import React, { useCallback, useEffect, useState, useRef } from "react";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import CustomButton from "@/components/CustomButton";
import { useFocusEffect } from "@react-navigation/native";

const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";
let foregroundSubscription: Location.LocationSubscription | null = null;

// Define the background task for location tracking
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({
    data,
    error,
  }: {
    data?: { locations: Location.LocationObject[] };
    error?: TaskManager.TaskManagerError | null;
  }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      // Extract location coordinates from data
      const { locations } = data;
      const location = locations[0];
      if (location) {
        console.log("Location in background", location.coords);
      }
    }
  }
);

export default function Explore() {
  // Define position state: {latitude: number, longitude: number}
  const [position, setPosition] =
    useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // Create a reference to the MapView
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    useCallback(() => {
      // Start location tracking when page is focused
      console.log("Explore page focused");
      startForegroundUpdate();

      // Stop location tracking when page loses focus
      return () => {
        stopForegroundUpdate();
        setIsFirstLoad(true);
      };
    }, [])
  );

  useEffect(
    useCallback(() => {
      if (mapRef.current && isFirstLoad && position) {
        mapRef.current.animateToRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.01, // Adjust the zoom level as needed
          longitudeDelta: 0.01, // Adjust the zoom level as needed
        });
        setIsFirstLoad(false);
      }
    }, [position])
  );

  const requestPermissions = async () => {
    try {
      const foreground = await Location.requestForegroundPermissionsAsync();
      console.log(foreground);
      if (foreground.granted) {
        const background = await Location.requestBackgroundPermissionsAsync();
        console.log(background);
      }
    } catch (error) {
      console.error("Permission request failed", error);
    }
    setModalVisible(false);
    startForegroundUpdate();
  };

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
    console.log("Starting foreground update");
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      setModalVisible(true);
      return;
    }

    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove();

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      (location) => {
        console.log(location);
        setPosition(location.coords);
      }
    );
  };

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    console.log("Stopping foreground update");
    foregroundSubscription?.remove();
    setPosition(null);
  };

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.log("Task is not defined");
      return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tracking stopped");
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View className="flex-1 items-center justify-center bg-black bg-opacity-50">
            <View className="bg-white p-5 rounded-lg w-4/5">
              <Text className="mb-5 text-center">
                To provide location-based features, we need permission to access
                your location at all times, even when you're not using the app.
                Please allow 'Always' for the feature to work.
              </Text>
              <CustomButton title="OK" handlePress={requestPermissions} />
            </View>
          </View>
        </Modal>
        <View className="flex-1 items-center justify-center">
          <MapView
            ref={mapRef} // Attach the ref to the MapView
            className="w-full h-[25vh]"
            initialRegion={{
              latitude: 1.3521,
              longitude: 103.8198,
              latitudeDelta: 0.18,
              longitudeDelta: 0.08,
            }}
            showsUserLocation={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
