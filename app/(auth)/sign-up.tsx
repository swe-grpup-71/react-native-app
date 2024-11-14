import * as React from "react";
import { Text, TextInput, Button, View, ScrollView, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [username, setUsername] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const sendInboxMessages = async (userId: string | null) => {
    if (!userId) {
      console.log(`UserID: ${userId}. Messages not sent.`);
      return;
    }

    try {
      const response = await fetch(
        "https://buzztracker-backend.youkushaders-1.workers.dev/inbox/create-messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        console.log("API triggered for first login.");
      } else {
        const errorText = await response.text();
        console.error("API call failed:", errorText);
        Alert.alert("Error", `Failed to create messages: ${errorText}`);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        username,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      const errorMessage = err.errors
        .map((msg: { longMessage: any }) => msg.longMessage)
        .join("\n");
      Alert.alert("Error", errorMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        Alert.alert("Successful", "Account has been created.");
        sendInboxMessages(completeSignUp.createdUserId);
        router.replace("/home");
      } else {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Text className="text-2xl font-semibold text-black mt-10">
            Sign up to BuzzTracker
          </Text>
          {!pendingVerification && (
            <>
              <FormField
                title="Username"
                value={username}
                handleChangeText={(e) => setUsername(e)}
                otherStyles="mt-7"
              />
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
              {/* <Button title="Sign Up" onPress={onSignUpPress} /> */}
              <CustomButton
                title="Sign Up"
                handlePress={onSignUpPress}
                containerStyles="mt-7"
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
            </>
          )}
          {pendingVerification && (
            <>
              {/* <TextInput
                value={code}
                placeholder="Code..."
                onChangeText={(code) => setCode(code)}
              />
              <Button title="Verify Email" onPress={onPressVerify} /> */}
              <FormField
                title="Verification code"
                value={code}
                otherStyles="mt-7"
                handleChangeText={(code) => setCode(code)}
              />
              <CustomButton
                title="Verify Email"
                handlePress={onPressVerify}
                containerStyles="mt-7"
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
