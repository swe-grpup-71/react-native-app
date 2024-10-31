// services/geofencing.ts
import { CLUSTER_DATASET } from '@/constants/ClusterDataset'; // Adjust the import path as needed
import { bufferPolygons } from '@/utils/bufferPolygons'; // Adjust the import path as needed
import * as turf from '@turf/turf';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const GEOFENCE_TASK_NAME = 'GEOFENCE_TASK';
const LOCATION_TASK_NAME = "BACKGROUND_LOCATION_TASK";

// Define the background task for location tracking
  const defineBackgroundLocationTask = () => {
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
    
  }

  // Start location tracking in background
  export const startBackgroundUpdate = async () => {
    defineBackgroundLocationTask();
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
      // showsBackgroundLocationIndicator: true,
      // foregroundService: {
      //   notificationTitle: "Location",
      //   notificationBody: "Location tracking in background",
      //   notificationColor: "#fff",
      // },
    });
    const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)
    console.log("Background location started?", started);
    const taskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
    console.log("Background location task registered?", taskRegistered);
  };

  // Stop location tracking in background
  export const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Background location tracking stopped");
    }
  };

const defineGeofencingTask = () => {
  TaskManager.defineTask(GEOFENCE_TASK_NAME, ({ data, error }) => {
    if (error) {
      console.error('Geofencing task error:', error);
      return;
    }
    if (data) {
        // console.log('Geofencing event data:', data);
        const { eventType, region } = data as {
        eventType: Location.GeofencingEventType;
        region: Location.LocationRegion;
      };
      if (eventType === Location.GeofencingEventType.Enter) {
        console.log(`You've entered region: ${region.identifier}, Long: ${region.longitude} Lat: ${region.latitude}`);
      } 
      /*else if (eventType === Location.GeofencingEventType.Exit) {
        console.log(`You've left region: ${region.identifier}`);
      }*/
    }
  });
};

export const startGeofencing = async () => {
  defineGeofencingTask();
    console.log('Requesting background location permissions');
  const { granted } = await Location.requestBackgroundPermissionsAsync();
  if (!granted) {
    console.log('Background location permission not granted');
    return;
  }

  const isTaskDefined = await TaskManager.isTaskDefined(GEOFENCE_TASK_NAME);
  if (!isTaskDefined) {
    console.log("Task is not defined");
    return;
  }

  const hasStarted = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
  if (hasStarted) {
    console.log("Already started");
    return;
  }

  console.log('Buffering polygons for geofencing');
  // Buffer the polygons to create geofencing regions
  const bufferedDataset = bufferPolygons(CLUSTER_DATASET, 200); // Buffer by 200 meters

  const geofences = bufferedDataset.features.map((feature) => {
    if (!feature.properties) {
      console.warn("Feature properties are null");
      return null;
    }

    const geometry = feature.geometry;
    if (geometry.type !== "Polygon") {
      console.warn("Unsupported geometry type");
      return null;
    }

    // Assuming the buffered polygon is a simple polygon and using its centroid for geofencing
    const centroid = turf.centroid(feature);
    const [longitude, latitude] = centroid.geometry.coordinates;

    // console.log(`Setting up geofence for region: ${feature.properties.Name}`);
    return {
      identifier: feature.properties.Name,
      latitude,
      longitude,
      radius: 200, // 200 meters
      notifyOnEnter: true,
      // notifyOnExit: true,
    };
  }).filter(Boolean); // Filter out any null values

  // console.log('Starting geofencing with regions:', geofences);
await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, geofences as Location.LocationRegion[]);
const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
console.log("Geofencing started?", started);
const taskRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
console.log("Geofencing task registered?", taskRegistered);
};

export const stopGeofencing = async () => {
    console.log('Stopping geofencing');
await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
};

export const geofenceEnabled = async () => {
  return (await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME) && await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME));
}