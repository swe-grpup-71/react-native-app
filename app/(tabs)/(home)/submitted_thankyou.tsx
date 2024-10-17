import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function ThankYouScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank you for your response!</Text>
      <Text style={styles.subtitle}>Here are some additional steps to take</Text>

      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>Tips & Tricks</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#d3d3d3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageText: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#7b4b52',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
