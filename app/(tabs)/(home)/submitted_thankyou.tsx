import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ThankYouScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank you for your response!</Text>
      <Text style={styles.subtitle}>Here are some additional steps to take</Text>

      <View style={styles.imagePlaceholder}>
        <ScrollView style={styles.scrollViewContent}>
          <Text style={styles.titleText}>
            Tip 1: Stay Hydrated
          </Text>
          <Text style={styles.imageText}>
            Drink plenty of fluids like water, coconut water, and oral rehydration solutions (ORS) to prevent dehydration.
          </Text>

          <Text style={styles.titleText}>
            Tip 2: Monitor Your Symptoms
          </Text>
          
          <Text style={styles.imageText}>
            Watch for warning signs like bleeding gums, severe abdominal pain, persistent vomiting, or rapid breathing, which may indicate severe dengue and require immediate medical attention
          </Text>

          <Text style={styles.titleText}>
            Tip 3: Be Patient with Recovery
          </Text>    

          <Text style={styles.imageText}>
            Full recovery from dengue can take a few weeks, and lingering fatigue is common.
          </Text>

          <Text style={styles.titleText}>
            Tip 4: Follow Up with Your Doctor
          </Text>
          
          <Text style={styles.imageText}>
            Report any lingering or worsening symptoms, as they could be signs of complications or secondary infections
          </Text>
        </ScrollView>
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
    marginBottom: 5,
    padding: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 300,
    height: 600,
    backgroundColor: '#d3d3d3',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 10,
  },
  imageText: {
    fontSize: 18,
    color: '#333',
    padding: 10,
    paddingLeft: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 0,
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
  scrollViewContent: {
    width: '100%',       
    marginBottom: 20,
  },
});
