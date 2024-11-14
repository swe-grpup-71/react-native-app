import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField"; // Import the FormField component
import CustomButton from "@/components/CustomButton";
import { router, Link } from "expo-router";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError, useUser } from "@clerk/clerk-expo";

export default function ChangePasswordScreen() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [form, setForm] = useState({
    oldpassword: "",
    newpassword: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleChangePassword = async () => {
    if (form.oldpassword === "" || form.newpassword === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLoaded || !isSignedIn) return;

    setSubmitting(true);

    try {
      await user
        .updatePassword({
          currentPassword: form.oldpassword,
          newPassword: form.newpassword,
        })
        .then(() => {
          Alert.alert("Successful", "Your password has been changed.");
          router.back();
        });
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.log(JSON.stringify(err, null, 2));
      const errorMessage = err.errors
        .map((msg: { longMessage: any }) => msg.longMessage)
        .join("\n");
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 20,
          backgroundColor: "#f5f5f5",
        }}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 50,
          }}
        >
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
