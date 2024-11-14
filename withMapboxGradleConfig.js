const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withMapboxGradleConfig(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("url 'https://api.mapbox.com/downloads/v2/releases/maven'")) {
      // If the configuration is already present, return as is.
      return config;
    }

    const mapboxMavenRepo = `
        maven {
            url 'https://api.mapbox.com/downloads/v2/releases/maven'
            authentication { basic(BasicAuthentication) }
            credentials {
                username = 'mapbox'
                password = project.properties['MAPBOX_DOWNLOADS_TOKEN'] ?: ""
            }
        }
    `;

    // Add the Mapbox Maven repository to the `allprojects.repositories` block.
    config.modResults.contents = config.modResults.contents.replace(
      /allprojects \{(\s*repositories \{)/,
      `allprojects {$1\n${mapboxMavenRepo}`
    );

    return config;
  });
};
