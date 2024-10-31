import CustomButton from "@/components/CustomButton";
import { CLUSTER_DATASET } from "@/constants/ClusterDataset";
import { bufferPolygons } from "@/utils/bufferPolygons";
import {
  geofenceEnabled,
  startBackgroundUpdate,
  startGeofencing,
  stopBackgroundUpdate,
  stopGeofencing,
} from "@/utils/geofencing";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect } from "@react-navigation/native";
import MapboxGL from "@rnmapbox/maps";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiY2hvbzAxOTUiLCJhIjoiY20ydm9kbm93MGR3YTJpcHoxdTlnamU4biJ9.EJIsQgXua7fhDx5tGyiBhg"
);

let foregroundSubscription: Location.LocationSubscription | null = null;

export default function Explore() {
  // Define position state: {latitude: number, longitude: number}
  const [position, setPosition] =
    useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [enableZoom, setEnableZoom] = useState<boolean>(true);
  const [isGeofencingEnabled, setIsGeofencingEnabled] =
    useState<boolean>(false);

  // Create a reference to the MapView
  const mapRef = useRef<MapView>(null);

  // Buffer the polygons from the CLUSTER_DATASET
  const bufferedDataset = bufferPolygons(CLUSTER_DATASET, 200); // Buffer by 200 meters

  useFocusEffect(
    useCallback(() => {
      // Start location tracking when page is focused
      console.log("Explore page focused");
      startForegroundUpdate();

      // Stop location tracking when page loses focus
      return () => {
        stopForegroundUpdate();
        setEnableZoom(true);
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const checkGeofencing = async () => {
        const enabled = await geofenceEnabled();
        console.log("Geofencing enabled?", enabled);
        setIsGeofencingEnabled(enabled);
      };
      checkGeofencing();
    }, [])
  );

  useEffect(
    useCallback(() => {
      if (mapRef.current && enableZoom && position) {
        mapRef.current.animateToRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.01, // Adjust the zoom level as needed
          longitudeDelta: 0.01, // Adjust the zoom level as needed
        });
        setEnableZoom(false);
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
        // console.log(location);
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

  const toggleGeofencing = async () => {
    if (isGeofencingEnabled) {
      console.log("Disabling geofencing");
      await stopBackgroundUpdate();
      await stopGeofencing();
      console.log("Geofencing stopped");
    } else {
      console.log("Enabling geofencing");
      await startBackgroundUpdate();
      await startGeofencing();
      console.log("Geofencing started");
    }
    setIsGeofencingEnabled(!isGeofencingEnabled);
  };

  // Function to focus on the user's location
  const focusOnUserLocation = () => {
    if (position) {
      setEnableZoom(true);
      setTimeout(() => {
        setEnableZoom(false);
      }, 2000);
    }
  };

  return (
    <View className="flex-1 m-0 p-0">
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
      <View className="flex-1 items-center justify-center m-0 p-0">
        <MapboxGL.MapView
          // ref={mapRef} // Attach the ref to the MapView
          className="w-full h-full"
          styleURL={MapboxGL.StyleURL.Light}
        >
          {position && enableZoom && (
            <MapboxGL.Camera
              zoomLevel={14}
              centerCoordinate={[position.longitude, position.latitude]}
              animationDuration={2000}
            />
          )}
          <MapboxGL.ShapeSource id="bufferedDataset" shape={bufferedDataset}>
            <MapboxGL.FillLayer
              id="bufferedFill"
              style={{
                fillColor: "#ae9ea4",
                fillOpacity: 0.3,
              }}
            />
            <MapboxGL.LineLayer
              id="bufferedOutline"
              style={{
                lineColor: "#9e8b91", // Same color as the fill or a contrasting one
                lineWidth: 2, // Thickness of the outline
              }}
            />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id="clusterDataset" shape={CLUSTER_DATASET}>
            <MapboxGL.FillLayer
              id="clusterFill"
              style={{
                // fillColor: "#ae9ea4",
                // fillOutlineColor: "#5d3d48",
                fillColor: "#5d3d48",

                fillOpacity: 0.3,
              }}
            />
            <MapboxGL.LineLayer
              id="clusterOutline"
              style={{
                lineColor: "#2f1f24", // Same color as the fill or a contrasting one
                lineWidth: 2, // Thickness of the outline
              }}
            />
          </MapboxGL.ShapeSource>
          <MapboxGL.UserLocation />
        </MapboxGL.MapView>
        <View className="absolute bottom-[4vh] items-center">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${
              isGeofencingEnabled ? "bg-primary" : "bg-white"
            }`}
            onPress={toggleGeofencing}
          >
            <Text
              className={`font-semibold ${
                isGeofencingEnabled ? "text-white" : ""
              }`}
            >
              {isGeofencingEnabled ? "Disable geofencing" : "Enable geofencing"}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-[4vh] right-[4vh] items-center">
          <TouchableOpacity
            className="bg-white rounded-lg p-1"
            onPress={focusOnUserLocation}
          >
            <FontAwesome6 name="location-crosshairs" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
