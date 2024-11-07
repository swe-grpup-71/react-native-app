"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in,
  // redirect them to the home page
  if (isSignedIn) {
    router.push("/home");
  }

  // Send the password reset code to the user's email
  // async function create(e: React.FormEvent) {
  //   e.preventDefault();
  //   await signIn
  //     ?.create({
  //       strategy: "reset_password_email_code",
  //       identifier: email,
  //     })
  //     .then((_) => {
  //       setSuccessfulCreation(true);
  //       setError("");
  //     })
  //     .catch((err) => {
  //       console.error("error", err.errors[0].longMessage);
  //       setError(err.errors[0].longMessage);
  //     });
  // }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  // async function reset(e: React.FormEvent) {
  //   e.preventDefault();
  //   await signIn
  //     ?.attemptFirstFactor({
  //       strategy: "reset_password_email_code",
  //       code,
  //       password,
  //     })
  //     .then((result) => {
  //       // Check if 2FA is required
  //       if (result.status === "needs_second_factor") {
  //         setSecondFactor(true);
  //         setError("");
  //       } else if (result.status === "complete") {
  //         // Set the active session to
  //         // the newly created session (user is now signed in)
  //         setActive({ session: result.createdSessionId });
  //         setError("");
  //       } else {
  //         console.log(result);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("error", err.errors[0].longMessage);
  //       setError(err.errors[0].longMessage);
  //     });
  // }

  // Send the password reset code to the user's email
  const create = async () => {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.log("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
        Alert.alert("Error", err.errors[0].longMessage);
      });
  };

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  const reset = async () => {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          Alert.alert("Successful", "Password has been reset.");
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.log("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
        Alert.alert("Error", err.errors[0].longMessage);
      });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {!successfulCreation && (
          <View className="w-full justify-center h-full px-4 my-6">
            <Text className="text-2xl font-semibold text-black mt-10">
              Forgot password 2
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
              handlePress={create}
              containerStyles="mt-7"
            />
            <View className="flex justify-center pt-5 flex-row gap-2">
              <Link
                href="/sign-in2"
                className="text-lg font-semibold text-primary"
              >
                Back to sign in.
              </Link>
            </View>
          </View>
        )}

        {successfulCreation && (
          <View className="w-full justify-center h-full px-4 my-6">
            <Text className="text-2xl font-semibold text-black mt-10">
              Forgot password 2
            </Text>
            <FormField
              title="New password"
              value={password}
              handleChangeText={(e) => setPassword(e)}
              otherStyles="mt-7"
            />
            <FormField
              title="Reset code"
              value={code}
              handleChangeText={(e) => setCode(e)}
              otherStyles="mt-7"
            />
            <CustomButton
              title="Reset Password"
              handlePress={reset}
              containerStyles="mt-7"
            />
            <View className="flex justify-center pt-5 flex-row gap-2">
              <Link
                href="/sign-in2"
                className="text-lg font-semibold text-primary"
              >
                Back to sign in.
              </Link>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordPage;
