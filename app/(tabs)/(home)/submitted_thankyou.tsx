import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function ThankYouScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thank you for your response!</Text>
      <Text style={styles.subtitle}>Here are some additional steps to take</Text>

      <View style={styles.tipsContainer}>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Tip 1: Stay Hydrated</Text>
          <Text style={styles.tipText}>
            Drink plenty of fluids like water, coconut water, and oral rehydration solutions (ORS) to prevent dehydration.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Tip 2: Monitor Your Symptoms</Text>
          <Text style={styles.tipText}>
            Watch for warning signs like bleeding gums, severe abdominal pain, persistent vomiting, or rapid breathing, which may indicate severe dengue and require immediate medical attention.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Tip 3: Be Patient with Recovery</Text>
          <Text style={styles.tipText}>
            Full recovery from dengue can take a few weeks, and lingering fatigue is common.
          </Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Tip 4: Follow Up with Your Doctor</Text>
          <Text style={styles.tipText}>
            Report any lingering or worsening symptoms, as they could be signs of complications or secondary infections.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(home)/home')}>
        <Text style={styles.buttonText}>Back Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    paddingTop: 80,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  tipsContainer: {
    width: '100%',
  },
  tipCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#7b4b52',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
