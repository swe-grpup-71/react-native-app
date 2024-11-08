import 'dotenv/config';
import baseConfig from './app.json';

export default {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    plugins: [
      ...(baseConfig.expo.plugins || []),
      // [
      //   "@rnmapbox/maps",
      //   {
      //     RNMapboxMapsDownloadToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
      //   }
      // ]
    ],
  },
};
