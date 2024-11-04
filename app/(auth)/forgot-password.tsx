import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Link } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, Alert} from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (email === "") {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setSubmitting(true);

    try {
      // Replace with your actual backend API endpoint
      const response = await fetch("https://buzztracker-backend.youkushaders-1.workers.dev/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        const result = await response.json();
        Alert.alert("Success", "Password reset email sent successfully");
        // Handle additional actions like storing recovery token if necessary
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to reset password");
      }
    } catch (error) {
      Alert.alert("Error", (error as any).message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Forgot password
          </Text>
          <FormField
            title="Email"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <CustomButton
            title="Reset Password"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-primary"
            >
              Back to sign in.
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
