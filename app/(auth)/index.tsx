import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { user } = useUser();

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <SignedIn>
            <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
          </SignedIn>
          <SignedOut>
            <Link href="./sign-in2">
              <Text>Sign In</Text>
            </Link>
            <Link href="./sign-up2">
              <Text>Sign Up</Text>
            </Link>
          </SignedOut>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
