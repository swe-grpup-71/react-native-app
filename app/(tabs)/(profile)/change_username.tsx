import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField"; // Import the FormField component
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { ClerkAPIError } from "@clerk/types";
import { isClerkAPIResponseError, useUser } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

export default function ChangeUsernameScreen() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [form, setForm] = useState({
    newUsername: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ClerkAPIError[]>();

  const handleChangeUsername = async () => {
    if (form.newUsername === "") {
      Alert.alert("Error", "Please fill in the username field");
      return;
    }

    if (!isLoaded || !isSignedIn) return;

    if (form.newUsername === user.username) {
      Alert.alert(
        "Error",
        "Username is same as current. Please enter a different username."
      );
      return;
    }

    setSubmitting(true);

    try {
      await user.update({ username: form.newUsername }).then(async () => {
        Alert.alert("Successful", "Your username has been changed.");
        await SecureStore.setItemAsync("username", form.newUsername);
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
            paddingTop: 100,
          }}
        >
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
