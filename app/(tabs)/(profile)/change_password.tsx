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
import FormField from "@/components/FormField";
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

    // try {
    //   const token = await AsyncStorage.getItem("authToken");

    //   //   if (!token) {
    //   //     Alert.alert("Error", "You are not authorized. Please log in again.");
    //   //     setSubmitting(false);
    //   //     return;
    //   //   }

    //   const response = await fetch(
    //     "https://buzztracker-backend.youkushaders-1.workers.dev/user/change-password",
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         // "Authorization": `Bearer ${token}`, // Include token in headers
    //       },
    //       body: JSON.stringify({
    //         oldPassword: form.oldpassword,
    //         newPassword: form.newpassword,
    //       }),
    //     }
    //   );

    //   const contentType = response.headers.get("content-type");
    //   let result;

    //   if (contentType && contentType.includes("application/json")) {
    //     result = await response.json();
    //   } else {
    //     result = await response.text();
    //   }

    //   if (response.status === 200 && result.status) {
    //     Alert.alert("Success", "Password changed successfully");
    //     router.push("/Profile");
    //   } else if (response.status === 401) {
    //     Alert.alert("Error", result.message || "Old password is incorrect");
    //   } else {
    //     console.log("Response Body:", result);
    //     Alert.alert("Error", result.message || "Failed to change password");
    //   }
    // } catch (error) {
    //   console.warn("Network error:", error);
    //   const errorMessage =
    //     error instanceof Error ? error.message : "An error occurred";
    //   Alert.alert("Error", errorMessage);
    // } finally {
    //   setSubmitting(false);
    // }
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
            paddingTop: 100,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "600", color: "black" }}>
            Change Password
          </Text>

          <FormField
            title="Old Password"
            value={form.oldpassword}
            handleChangeText={(e) => setForm({ ...form, oldpassword: e })}
            otherStyles="mt-7"
            secureTextEntry={!isPasswordVisible} // Toggle visibility
          />

          <FormField
            title="New Password"
            value={form.newpassword}
            handleChangeText={(e) => setForm({ ...form, newpassword: e })}
            otherStyles="mt-7"
            secureTextEntry={!isPasswordVisible} // Toggle visibility
          />

          {/* Optional: Add an eye icon to toggle password visibility */}
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Text style={{ color: "#5d3d48", marginTop: 10 }}>
              {isPasswordVisible ? "Hide Password" : "Show Password"}
            </Text>
          </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#5A2D34",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
