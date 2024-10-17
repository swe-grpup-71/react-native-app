import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-4">
          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Welcome to BuzzTracker
            </Text>
          </View>
          <CustomButton
            title="Let's go!"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
