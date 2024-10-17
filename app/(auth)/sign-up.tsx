import { View, Alert, ScrollView, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { router, Link } from "expo-router";
import CustomButton from "@/components/CustomButton";

export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    router.push("/home");
    return;
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      // await signIn(form.email, form.password);
      // const result = await getCurrentUser();
      // setUser(result);
      // setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      // router.replace("/home");
    } catch (error) {
      // Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Sign up to BuzzTracker
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
