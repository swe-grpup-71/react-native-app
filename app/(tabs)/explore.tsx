import CustomButton from "@/components/CustomButton";
import DengueClusterTooltip from "@/components/DengueClusterTooltip";
import { bufferPolygons } from "@/utils/bufferPolygons";
import { getClusterDatasetFromAPI } from "@/utils/clusterAPI";
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
import { OnPressEvent } from "@rnmapbox/maps/lib/typescript/src/types/OnPressEvent";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";

interface DengueClusterData {
  LOCALITY: string;
  CASE_SIZE: string;
  NAME: string;
  HYPERLINK: string;
  HOMES: string;
  PUBLIC_PLACES: string;
  CONSTRUCTION_SITES: string;
  INC_CRC: string;
  FMEL_UPD_D: string;
}

const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
MapboxGL.setAccessToken(token);

let foregroundSubscription: Location.LocationSubscription | null = null;

export default function Explore() {
  // Define position state: {latitude: number, longitude: number}
  const [position, setPosition] =
    useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [enableZoom, setEnableZoom] = useState<boolean>(true);
  const [isGeofencingEnabled, setIsGeofencingEnabled] =
    useState<boolean>(false);
  const [foregroundEnabled, setForegroundEnabled] = useState(false);
  const [clusterDataset, setClusterDataset] =
    useState<FeatureCollection<Geometry>>();
  const [bufferedDataset, setBufferedDataset] =
    useState<FeatureCollection<Polygon | MultiPolygon>>();
  const [selectedCluster, setSelectedCluster] = useState<{
    features: Array<GeoJSON.Feature>;
    coordinates: { latitude: number; longitude: number };
    clusterData: DengueClusterData;
  } | null>(null);

  // Create a reference to the MapView
  const mapRef = useRef<MapView>(null);

  // Buffer the polygons from the CLUSTER_DATASET
  // const bufferedDataset = bufferPolygons(CLUSTER_DATASET, 200); // Buffer by 200 meters

  useFocusEffect(
    useCallback(() => {
      // Start location tracking when page is focused
      console.log("Explore page focused");
      getClusterDataset();
      startForegroundUpdate();
      checkGeofencing();

      // Stop location tracking when page loses focus
      return () => {
        stopForegroundUpdate();
        setEnableZoom(true);
      };
    }, [])
  );

  useEffect(() => {
    const getFeaturesOrderedByCaseSize = (
      features: Feature<Geometry, GeoJsonProperties>[]
    ) => {
      // Extract CASE_SIZE and Name from each feature, then sort by CASE_SIZE in descending order
      const casesWithNames = features
        .map((feature) => {
          // Ensure properties and Description exist
          if (!feature.properties || !feature.properties.Description) {
            return { name: feature.properties?.Name || "Unknown", caseSize: 0 };
          }

          const caseSize = parseInt(
            feature.properties.Description.match(
              /<th>CASE_SIZE<\/th> <td>(\d+)<\/td>/
            )?.[1] || "0",
            10
          );

          return { name: feature.properties.Name || "Unknown", caseSize };
        })
        .sort((a, b) => b.caseSize - a.caseSize); // Sort by caseSize in descending order

      return casesWithNames;
    };

    if (clusterDataset) {
      const orderedClusters = getFeaturesOrderedByCaseSize(
        clusterDataset.features
      );
      // console.log(orderedClusters);
    }
  }, [clusterDataset]);

  useEffect(() => {
    if (enableZoom && position) {
      setEnableZoom(false);
    }
  }, [position]);

  const getClusterDataset = async () => {
    const dataset = (await getClusterDatasetFromAPI()) as string;
    // console.log(clusterDataset);
    try {
      const geoJsonObject = JSON.parse(dataset) as FeatureCollection<Geometry>;
      setClusterDataset(geoJsonObject);
      const bufferedObject = bufferPolygons(geoJsonObject, 200);
      setBufferedDataset(bufferedObject);
    } catch (error) {
      console.error("Invalid GeoJSON string:", error);
    }
  };

  const checkGeofencing = async () => {
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log(
        "Background location permissions not allowed, enabled to check geofencing status."
      );
      return;
    }
    const enabled = await geofenceEnabled();
    console.log("Geofencing enabled?", enabled);
    setIsGeofencingEnabled(enabled);
  };

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
    checkGeofencing();
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
    } else {
      setForegroundEnabled(true);
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

  const requestNotificationsPermissions = async (
    settings: Notifications.NotificationPermissionsStatus
  ) => {
    if (settings.status === "undetermined") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notifications permissions not granted");
      }
    } else if (settings.status === "denied") {
      Alert.alert(
        "Notifications Disabled",
        "To receive updates, please enable notifications in your settings.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go to Settings", onPress: openSettings },
        ]
      );
    }
  };

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Unable to open settings");
    });
  };

  const toggleGeofencing = async () => {
    if (isGeofencingEnabled) {
      console.log("Disabling geofencing");
      await stopBackgroundUpdate();
      await stopGeofencing();
      console.log("Geofencing stopped");
    } else {
      const settings = await Notifications.getPermissionsAsync();
      if (
        settings.granted ||
        settings.ios?.status ===
          Notifications.IosAuthorizationStatus.PROVISIONAL
      ) {
        console.log("Enabling geofencing");
        await startBackgroundUpdate();
        await startGeofencing();
        console.log("Geofencing started");
      } else {
        requestNotificationsPermissions(settings);
        return;
      }
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

  const handleClusterPress = (e: OnPressEvent) => {
    const { features, coordinates } = e;
    function extractTableDataToJson(htmlString: string): DengueClusterData {
      // Create a DOMParser-like environment for Node.js
      const result: DengueClusterData = {
        LOCALITY: "",
        CASE_SIZE: "",
        NAME: "",
        HYPERLINK: "",
        HOMES: "",
        PUBLIC_PLACES: "",
        CONSTRUCTION_SITES: "",
        INC_CRC: "",
        FMEL_UPD_D: "",
      };

      // Use regex to extract data
      const rows = htmlString.match(/<tr[^>]*>.*?<\/tr>/gs) || [];

      rows.forEach((row) => {
        // Skip the header row
        if (row.includes("<em>Attributes</em>")) return;

        // Extract the header (th) and data (td)
        const headerMatch = row.match(/<th[^>]*>(.*?)<\/th>/);
        const dataMatch = row.match(/<td[^>]*>(.*?)<\/td>/);

        if (headerMatch && dataMatch) {
          const key = headerMatch[1].trim() as keyof DengueClusterData;
          const value = dataMatch[1].trim();
          result[key] = value;
        }
      });

      return result;
    }

    const clusterData = extractTableDataToJson(
      features[0]?.properties?.Description
    );
    console.log(clusterData);
    setSelectedCluster({ features, coordinates, clusterData });
  };

  const handleCameraChange = (e: any) => {
    if (e.properties.zoom < 12) {
      setSelectedCluster(null);
    }
  };

  return (
    <View className="flex-1 m-0 p-0">
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-4/5">
            {/* <Text className="mb-5 text-center">
              To provide location-based features, we need permission to access
              your location at all times, even when you're not using the app.
              Please allow 'Always' for the feature to work.
            </Text> */}
            <Text className="text-lg font-bold mb-2">
              Enable Location & Notifications for Dengue Alerts
            </Text>
            <Text className="mb-2 text-justify font-semibold">
              To keep you safe and provide timely alerts about dengue clusters,
              please enable the following:
            </Text>
            <Text className="mb-2 px-2 text-justify">
              <Text className="font-semibold">Android:</Text> Go to Settings{" "}
              {">"} Location {">"} App permissions and set to "Allow all the
              time." Also, go to Settings {">"} Apps {">"} Your App {">"}{" "}
              Notifications and ensure they are enabled.
            </Text>
            <Text className="mb-5 px-2 text-justify">
              <Text className="font-semibold">IOS:</Text> Go to Settings {">"}{" "}
              Privacy {">"} Location Services {">"} Your App and select
              "Always." Also, go to Settings {">"} Notifications {">"} Your App
              and ensure notifications are enabled.
            </Text>
            <CustomButton title="OK" handlePress={requestPermissions} />
          </View>
        </View>
      </Modal>
      {foregroundEnabled && (
        <View className="flex-1 items-center justify-center m-0 p-0">
          <MapboxGL.MapView
            // ref={mapRef} // Attach the ref to the MapView
            className="w-full h-full"
            styleURL={MapboxGL.StyleURL.Light}
            onPress={() => setSelectedCluster(null)}
            onCameraChanged={handleCameraChange}
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

            <MapboxGL.ShapeSource
              id="clusterDataset"
              shape={clusterDataset}
              onPress={handleClusterPress}
            >
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
            {selectedCluster && (
              <MapboxGL.MarkerView
                coordinate={[
                  selectedCluster.coordinates.longitude,
                  selectedCluster.coordinates.latitude,
                ]} // Use coordinates from the selected cluster
              >
                <View>
                  <DengueClusterTooltip data={selectedCluster.clusterData} />
                </View>
              </MapboxGL.MarkerView>
            )}
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
                {isGeofencingEnabled
                  ? "Disable geofencing"
                  : "Enable geofencing"}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="absolute bottom-[4vh] right-[4vh] items-center">
            <TouchableOpacity
              className="bg-white rounded-lg p-1"
              onPress={focusOnUserLocation}
            >
              <FontAwesome6
                name="location-crosshairs"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
