import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
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
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/forgot-password"
              className="text-lg font-semibold text-primary"
            >
              Forgot password?
            </Link>
          </View>
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-regular">Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-semibold text-primary"
            >
              Sign up now.
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
