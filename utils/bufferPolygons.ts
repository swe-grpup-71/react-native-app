import * as turf from '@turf/turf';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, MultiPolygon, Polygon } from 'geojson';

/**
 * Buffers each polygon in the dataset by a specified distance.
 * @param dataset - The GeoJSON FeatureCollection containing polygons.
 * @param distance - The buffer distance in meters.
 * @returns A new FeatureCollection with buffered polygons.
 */
export const bufferPolygons = (
  dataset: FeatureCollection<Geometry>,
  distance: number
): FeatureCollection<Polygon | MultiPolygon> => {
  const bufferedFeatures = dataset.features
    .map((feature) => {
      if (feature.geometry.type === 'Polygon') {
        return turf.buffer(feature, distance, { units: 'meters' }) as Feature<Polygon | MultiPolygon>;
      }
      return undefined; // Explicitly return undefined for non-polygon features
    })
    .filter((feature): feature is Feature<Polygon | MultiPolygon, GeoJsonProperties> => feature !== undefined);

  return {
    type: "FeatureCollection",
    features: bufferedFeatures,
  };
};