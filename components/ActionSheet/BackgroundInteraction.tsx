import React, { RefObject } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { center } from "@turf/turf";

type Props = {
  actionSheetRef: RefObject<ActionSheetRef>;
  isGeofencingEnabled: boolean;
  toggleGeofencing: () => void;
  focusOnUserLocation: () => void;
};

function BackgroundInteraction({
  actionSheetRef,
  isGeofencingEnabled,
  toggleGeofencing,
  focusOnUserLocation,
}: Props) {
  return (
    <ActionSheet
      ref={actionSheetRef}
      isModal={false}
      backgroundInteractionEnabled={true}
      snapPoints={[30, 100]}
      closable={false}
      disableDragBeyondMinimumSnapPoint
      gestureEnabled
      containerStyle={{
        borderWidth: 1,
        borderColor: "#f0f0f0",
      }}
    >
      <View className="absolute top-[-15%] left-[32%]">
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
      <View className="absolute top-[-15%] right-[5%]">
        <TouchableOpacity
          className="bg-white rounded-lg p-1"
          onPress={focusOnUserLocation}
        >
          <FontAwesome6 name="location-crosshairs" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: 12,
          height: 400,
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Interact with the views and buttons in background too?! 😲
        </Text>
      </View>
    </ActionSheet>
  );
}

export default BackgroundInteraction;
