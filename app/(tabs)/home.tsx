import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router} from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>BuzzTracker</Text>
      </View>

      <View style={styles.welcomeSection}>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Welcome back, ____</Text>
        </View>

        <Text style={styles.statusText}>Current Dengue Status:</Text>

        <View style={styles.statusBox}>
          <Text style={styles.status}>Positive</Text>
        </View>
        <TouchableOpacity style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText} onPress={() => router.push('/(home)/viewMore')}>View More</Text>
        </TouchableOpacity>
      <Text style={styles.reportPrompt}>
          Have dengue? Report it so we can warn others
      </Text>
      
      <TouchableOpacity style={styles.reportButton} onPress={() => router.push('/(home)/report_form')}>
        <Text style={styles.reportButtonText}>Report Now</Text>
      </TouchableOpacity>
    
      </View>

      <View style={styles.articleSection}>
        <Text style={styles.articleText}>Article #1</Text>
      </View>
      <View style={styles.articleSection}>
        <Text style={styles.articleText}>Article #2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  headerWrapper: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "#cccccc",
    alignItems: "center",
    paddingBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  welcomeSection: {
    width: "90%",
    marginVertical: 20,
    alignItems: "center",
  },
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  welcomeText: {
    fontSize: 18,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    paddingTop: 10,
  },
  statusBox: {
    width: "80%",
    paddingVertical: 10,
    backgroundColor: "#d3d3d3",
    alignItems: "center",
    marginBottom: 10,
  },
  status: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 150,
  },
  viewMoreText: {
    color: "#ffffff",
    fontSize: 14,
  },
  reportButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    marginBottom: 30,
  },
  reportButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  reportPrompt: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  articleSection: {
    width: "90%",
    paddingVertical: 20,
    backgroundColor: "#d3d3d3",
    alignItems: "center",
    marginBottom: 20,
  },
  articleText: {
    fontSize: 18,
  },
});
