import { Redirect, Stack } from "expo-router";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/home"} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-in2"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up2"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password2"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
