import { Stack } from "expo-router";
import React from "react";

export default function HomeNavigation() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="report_form"
          options={{
            title: 'Report Form', headerShown: true
          }}
        />
          <Stack.Screen name="submitted_thankyou" options={{headerShown: false }} />
          <Stack.Screen name="viewMore" options={{headerShown: false }} />
      </Stack>
    </>
  );
}