import { View, Alert, ScrollView, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { router, Link } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "" || form.username === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    setSubmitting(true);
  
    try {
      const response = await fetch("https://buzztracker-backend.youkushaders-1.workers.dev/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
        },
        body: JSON.stringify(form),
      });
  
      if (response.status === 200) {
        const result = await response.json();
        await AsyncStorage.setItem("username", form.username);
        await AsyncStorage.setItem("email", form.email);
        Alert.alert("Success", "Account created successfully. Please log in.");
        router.push("/sign-in"); // Navigate to signin page after successful signup
      } else if (response.status === 409) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Email already exists");
      } else {
        Alert.alert("Error", "Failed to sign up");
      }
    } catch (error) {
      Alert.alert("Error", (error as any).message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };
  

    // try {
    //   // await signIn(form.email, form.password);
    //   // const result = await getCurrentUser();
    //   // setUser(result);
    //   // setIsLogged(true);

    //   Alert.alert("Success", "User signed in successfully");
    //   // router.replace("/home");
    // } catch (error) {
    //   // Alert.alert("Error", error.message);
    // } finally {
    //   setSubmitting(false);
    // }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Sign up to BuzzTracker
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            otherStyles="mt-7"
            handleChangeText={(e) => setForm({ ...form, password: e })}
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-regular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-semibold text-primary"
            >
              Sign in.
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
