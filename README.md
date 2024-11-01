# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables

   To configure your app to use Mapbox, you’ll need a `.env` file in the root directory. Follow these steps:

   - Create a `.env` file in the project root.
   - Add your Mapbox access token to the `.env` file like this:

     ```plaintext
     EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN="your_mapbox_access_token_here"
     ```

   If you don’t have an access token, you can get one by creating an account at [Mapbox](https://www.mapbox.com/).

3. Start the app

   **Option 1:** Run directly on your device without Expo Go app (recommended):

   1. **Connect your device via USB cable**:

      - Plug your Android or iOS device into your development computer using a USB cable.

   2. **Enable Developer Mode**:

      - **Android**: Go to **Settings > About phone** and tap on **Build number** 7 times to enable Developer Options.
      - **iOS**: Connect your device to your computer and open **Xcode**. Under **Devices and Simulators**, select your device and enable **Developer Mode**.

   3. **Enable USB Debugging**:

      - **Android**: Go to **Settings > Developer options** and enable **USB debugging**.
      - **iOS**: No additional debugging setup is required, but you may need to trust your computer on the device.

   4. **Run the app on your device**:
      - For Android:
        ```bash
        npx expo run:android -d
        ```
      - For iOS:
        ```bash
        npx expo run:ios -d
        ```

   **Option 2:** (Deprecated) Alternatively, you can use the following command to start the project, although this method may have limited functionality for your project.

   Note: React Native Mapbox Maps cannot be used with Expo Go as it requires native code.

   ```bash
   npx expo start
   ```

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open-source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
