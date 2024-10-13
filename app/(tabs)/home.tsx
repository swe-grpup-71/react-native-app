import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React from 'react';

const Home = () => {
  return (
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>BuzzTracker</Text>
      </View>

      {/* Welcome Text */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>
          Welcome back, <Text style={styles.nameText}>placeholder name</Text>
        </Text>

        {/* Dengue Status Section */}
        <Text style={styles.sectionTitle}>Current Dengue Status:</Text>
        <View style={styles.dengueStatus}>
          <Text style={styles.statusText}>Positive</Text>
        </View>
        <TouchableOpacity style={styles.viewMoreButton}>
          <Text style={styles.buttonText}>View More</Text>
        </TouchableOpacity>

        {/* Report Dengue Section */}
        <Text style={styles.reportPrompt}>
          Have dengue? Report it so we can warn others
        </Text>
        <TouchableOpacity style={styles.reportButton}>
          <Text style={styles.reportButtonText}>Report Now</Text>
        </TouchableOpacity>

        {/* Article Section */}
        <View style={styles.article}>
          <Text style={styles.articleText}>Article #2</Text>
        </View>
      </View>
    </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 18, // Base font size for "Welcome Back,"
  },
  nameText: {
    fontSize: 20, // Larger font size for "placeholder name"
    fontWeight: 'bold', // Optional: make the name bold
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    paddingTop: 20,
  },
  dengueStatus: {
    backgroundColor: '#e0e0e0', // Light gray background for status
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewMoreButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#6b3a3a', // Darker color for View More button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  reportPrompt: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  reportButton: {
    backgroundColor: '#6b3a3a', // Matching Report button color
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  article: {
    backgroundColor: '#d3d3d3', // Light gray for article section
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  articleText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default Home;
