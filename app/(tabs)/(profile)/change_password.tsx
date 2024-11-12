import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField"; // Import the FormField component
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

export default function ChangePasswordScreen() {
  const [form, setForm] = useState({
    oldpassword: "",
    newpassword: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChangePassword = async () => {
    if (form.oldpassword === "" || form.newpassword === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch("https://buzztracker-backend.youkushaders-1.workers.dev/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ oldPassword: form.oldpassword, newPassword: form.newpassword }),
      });

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      if (response.status === 200 && result.status) {
        Alert.alert("Success", "Password changed successfully");
        router.push("/Profile");
      } else if (response.status === 401) {
        Alert.alert("Error", result.message || "Old password is incorrect");
      } else {
        console.log("Response Body:", result);
        Alert.alert("Error", result.message || "Failed to change password");
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
        <View style={{ width: "100%", flex: 1, paddingHorizontal: 16, paddingTop: 50 }}>
          {/* Form Fields for Old and New Passwords */}
          <FormField
            title="Old Password"
            value={form.oldpassword}
            handleChangeText={(e) => setForm({ ...form, oldpassword: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="New Password"
            value={form.newpassword}
            handleChangeText={(e) => setForm({ ...form, newpassword: e })}
            otherStyles="mt-7"
          />

          {/* Submit Button */}
          <CustomButton
            title="Change Password"
            handlePress={handleChangePassword}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
