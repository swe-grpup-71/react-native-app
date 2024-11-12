import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField"; // Import the FormField component
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

export default function ChangeUsernameScreen() {
  const [form, setForm] = useState({
    newUsername: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChangeUsername = async () => {
    if (form.newUsername === "") {
      Alert.alert("Error", "Please fill in the username field");
      return;
    }

    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch("https://buzztracker-backend.youkushaders-1.workers.dev/user/change-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // "Authorization": `Bearer ${token}`, // Include token in headers if needed
        },
        body: JSON.stringify({ newUsername: form.newUsername }),
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (response.status === 200 && result.status) {
        Alert.alert("Success", "Username changed successfully");
        router.push("/Profile");
      } else {
        console.log("Response Body:", result);
        Alert.alert("Error", result.message || "Failed to change username");
      }
    } catch (error) {
      console.warn("Network error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, backgroundColor: "#f5f5f5" }}>
        <View style={{ width: "100%", flex: 1, paddingHorizontal: 16, paddingTop: 100 }}>
          <FormField
            title="New Username"
            value={form.newUsername}
            handleChangeText={(e) => setForm({ ...form, newUsername: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Change Username"
            handlePress={handleChangeUsername}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
