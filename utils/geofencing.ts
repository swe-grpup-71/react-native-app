// services/geofencing.ts
import { CLUSTER_DATASET } from '@/constants/ClusterDataset'; // Adjust the import path as needed
import { bufferPolygons } from '@/utils/bufferPolygons'; // Adjust the import path as needed
import * as turf from '@turf/turf';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const GEOFENCE_TASK_NAME = 'GEOFENCE_TASK';

export const defineGeofencingTask = () => {
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
console.log("hasStarted?:", started);
const taskRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
console.log("taskRegistered?:", taskRegistered);
};

export const stopGeofencing = async () => {
    console.log('Stopping geofencing');
await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
};