import { Stack } from "expo-router";
import React from "react";

export default function ProfileNavigation() {
  return (
    <>
      <Stack>
        <Stack.Screen name="Profile" options={{headerShown: false }} />
        <Stack.Screen
          name="change_password"
          options={{
            title: 'Change Password', headerShown: true
          }}
        />
          <Stack.Screen name="change_username" options={{title:"Change Username", headerShown: true }} />
          
      </Stack>
    </>
  );
}