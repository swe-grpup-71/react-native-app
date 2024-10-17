import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ReportDetails() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Report Details</Text>

      <View style={styles.detailsCard}>
        <Text style={styles.detailItem}>
          <Text style={styles.detailLabel}>Report Date: </Text>
          <Text style={styles.detailValue}>_____</Text>
        </Text>
        
        <Text style={styles.detailItem}>
          <Text style={styles.detailLabel}>Symptoms: </Text>
          <Text style={styles.detailValue}>_____</Text>
        </Text>
        
        <Text style={styles.detailItem}>
          <Text style={styles.detailLabel}>Frequently Visited Locations: </Text>
          <Text style={styles.detailValue}>_____</Text>
        </Text>
        
        <Text style={styles.detailItem}>
          <Text style={styles.detailLabel}>Remarks: </Text>
          <Text style={styles.detailValue}>_____</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#7b4b52',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  detailsCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 15,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    color: '#666',
  },
});
