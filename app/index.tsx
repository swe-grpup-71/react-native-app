import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ScrollView, View, Text, Image, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full flex justify-center items-center h-full px-4">
          <View className="relative mt-5">
            <Animated.Image
              source={require("../assets/images/icon.png")}
              style={{
                width: 150,
                height: 150,
                resizeMode: "contain",
                alignSelf: "center",
                marginBottom: 30,
                opacity: opacity,
                transform: [{ scale: scale }],
              }}
            />
            <Text className="text-3xl text-black font-bold text-center">
              Welcome to BuzzTracker
            </Text>
          </View>
          <CustomButton
            title="Let's go!"
            handlePress={() => router.replace("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
