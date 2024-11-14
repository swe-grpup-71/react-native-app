import 'dotenv/config';
import baseConfig from './app.json';
import withMapboxGradleConfig from './withMapboxGradleConfig';

export default {
  ...baseConfig,
  expo: {
    ...baseConfig.expo,
    plugins: [
      ...(baseConfig.expo.plugins || []),
      withMapboxGradleConfig,
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN || '',
        }
      ],
    ],
  },
};
