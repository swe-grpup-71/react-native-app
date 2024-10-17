import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { Link } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

  const submit = () => {
    console.log("reset password");
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
