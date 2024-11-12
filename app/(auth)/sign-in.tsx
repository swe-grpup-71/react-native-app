import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View, ScrollView, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>();

  const onSignInPress = React.useCallback(async () => {
    if (emailAddress === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (isClerkAPIResponseError(err)) setErrors(err.errors);
      console.log(JSON.stringify(err, null, 2));
      const errorMessage = err.errors
        .map((msg: { longMessage: any }) => msg.longMessage)
        .join("\n");
      Alert.alert("Error", errorMessage);
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Log in to BuzzTracker
          </Text>
          <FormField
            title="Email"
            value={emailAddress}
            handleChangeText={(e) => setEmailAddress(e)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={password}
            otherStyles="mt-7"
            handleChangeText={(e) => setPassword(e)}
          />
          <CustomButton
            title="Sign In"
            handlePress={onSignInPress}
            containerStyles="mt-7"
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
