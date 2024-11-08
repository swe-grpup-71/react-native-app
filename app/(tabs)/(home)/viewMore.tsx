import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function ReportDetails() {
  interface CaseItem {
    caseId: string;
    time: string;
    symptoms: string[];
    locations: { name: string; coordinates: { latitude: number; longitude: number } }[];
    remarks: string;
  }

  const [caseData, setCaseData] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get('https://buzztracker-backend.youkushaders-1.workers.dev/dengue/get-case');
        console.log('Response Data:', response.data); // Log to check the structure of the response

        if (response.status === 200 && response.data.status && Array.isArray(response.data.data)) {
          setCaseData(response.data.data);
        } else if (response.status === 200 && response.data.status && response.data.data) {
          // Handle single object case as an array
          setCaseData([response.data.data]);
        } else {
          setCaseData([]);
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          console.log('404: No cases found');
          setCaseData([]);
        } else if (err instanceof Error) {
          console.error('Error:', err.message);
          setError(err.message);
        } else {
          console.error('Unknown error occurred');
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#7b4b52" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  if (!Array.isArray(caseData) || caseData.length === 0) {
    return (
      <View style={styles.noCasesContainer}>
        <Text style={styles.noCasesText}>You have no cases :D</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Report Details</Text>
      {caseData.map((caseItem, index) => (
        <View key={index} style={styles.detailsCard}>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Report Date: </Text>
            <Text style={styles.detailValue}>{new Date(caseItem.time).toLocaleDateString()}</Text>
          </Text>

          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Symptoms: </Text>
            <Text style={styles.detailValue}>{caseItem.symptoms.join(', ')}</Text>
          </Text>

          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Frequently Visited Locations: </Text>
            {caseItem.locations.map((location, locIndex) => (
              <Text key={locIndex} style={styles.detailValue}>
                {location.name}
              </Text>
            ))}
          </Text>

          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Remarks: </Text>
            <Text style={styles.detailValue}>{caseItem.remarks || 'No remarks provided'}</Text>
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  noCasesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCasesText: {
    fontSize: 18,
    color: '#666',
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
    marginBottom: 20,
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
