import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router'; // Import router for navigation
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      }
    };
    loadProfileData();
  }, []);

  const profileInitial = username ? username.charAt(0).toUpperCase() : "";
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {/* Profile Image or Placeholder */}
          <Text style={styles.profileInitial}>{profileInitial}</Text>
        </View>
        <Text style={styles.profileName}>{username}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionContainer}>
        <ProfileOption title="Edit Profile" icon="chevron-right" />
        <ProfileOption title="Change Password" icon="chevron-right" />
        <ProfileOption title="Sign Out" icon="chevron-right" onPress={() => router.push('/')} />
      </View>
    </View>
  );
}

interface ProfileOptionProps {
  title: string;
  icon: string;
  onPress?: () => void;
}

const ProfileOption: React.FC<ProfileOptionProps> = ({ title, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.optionText}>{title}</Text>
      <FontAwesome name={icon} size={18} color="#7e7e7e" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F8',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitial: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  optionContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
