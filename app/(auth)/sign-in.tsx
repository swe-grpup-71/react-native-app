import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Async function to handle the sign-in request
interface SignInResponse {
  status: boolean;
  message?: string;
  data?: any;
}

async function signin(email: string, password: string): Promise<any> {
  try {
    const res = await fetch('https://buzztracker-backend.youkushaders-1.workers.dev/user/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })

    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const body: SignInResponse = await res.json();
    
    if (!body.status) {
      throw new Error(body.message || "Login failed");
    }

    return body.data;
    
  } catch (err) {
    console.warn("Network error:", err);
    throw err; // Rethrow the error so it can be handled by the calling function
  }
}

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      const userData = await signin(form.email, form.password);

      // If successful, show a success message
      Alert.alert("Success", "User signed in successfully");

      // Navigate to the home screen
      router.push("/home");

      // If you need to save user data or token, do it here (e.g., AsyncStorage)
      // await AsyncStorage.setItem("userToken", userData.token);

    } catch (error) {
      // Show the error message to the user
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in. Please try again.";
      Alert.alert("Error", errorMessage);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ width: '100%', justifyContent: 'center', height: '100%', paddingHorizontal: 16, marginTop: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: 'black', marginTop: 20 }}>
            Log in to BuzzTracker
          </Text>
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
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10 }}>
            <Link
              href="/forgot-password"
              style={{ fontSize: 16, fontWeight: '600', color: '#5d3d48' }}
            >
              Forgot password?
            </Link>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10 }}>
            <Text style={{ fontSize: 16 }}>Don't have an account?</Text>
            <Link
              href="/sign-up"
              style={{ fontSize: 16, fontWeight: '600', color: '#5d3d48', marginLeft: 4 }}
            >
              Sign up now.
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
