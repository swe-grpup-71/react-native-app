import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

export default function Details() {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remarks, setRemarks] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ name: string, coordinates: { latitude: number, longitude: number } }[]>([]);

  const handleSymptomSelect = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleLocationSelect = (location: string) => {
    if (location && !locations.find(loc => loc.name === location)) {
      // Example coordinates; these should come from your actual data source
      const coordinates = {
        latitude: Math.random() * 90, // Replace with actual latitude
        longitude: Math.random() * 180 // Replace with actual longitude
      };
      setLocations([...locations, { name: location, coordinates }]);
    }
  };

  const handleSymptomRemove = (symptom: string) => {
    setSymptoms(symptoms.filter(item => item !== symptom));
  };

  const handleLocationRemove = (location: string) => {
    setLocations(locations.filter(item => item.name !== location));
  };

  const handleSubmit = async () => {
    const payload = {
      symptoms,
      locations,
      remarks
    };

    try {
      const response = await fetch('https://buzztracker-backend.youkushaders-1.workers.dev/dengue/create-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', `Case created with ID: ${result.data.caseId}`);
        router.push('/submitted_thankyou');
      } else {
        Alert.alert('Error', 'Failed to create case');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while submitting the case');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Please answer the questions below</Text>

      <Text style={styles.label}>Pick your symptoms:</Text>
      {symptoms.length > 0 && (
        <View style={styles.chipContainer}>
          {symptoms.map((symptom, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleSymptomRemove(symptom)}
            >
              <Text style={styles.chipText}>{symptom} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text style={styles.pickerTitle}>Select a Symptom:</Text>
      <Picker
        selectedValue={selectedSymptom}
        onValueChange={(itemValue) => {
          setSelectedSymptom(itemValue);
          handleSymptomSelect(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Fever" value="Fever" />
        <Picker.Item label="Chills" value="Chills" />
        <Picker.Item label="Headache" value="Headache" />
      </Picker>

      <Text style={styles.label}>Frequency Visit Locations:</Text>
      {locations.length > 0 && (
        <View style={styles.chipContainer}>
          {locations.map((location, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleLocationRemove(location.name)}
            >
              <Text style={styles.chipText}>{location.name} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <Text style={styles.pickerTitle}>Select a Location:</Text>
      <Picker
        selectedValue={selectedLocation}
        onValueChange={(itemValue) => {
          setSelectedLocation(itemValue);
          handleLocationSelect(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="NTU" value="NTU" />
        <Picker.Item label="NUS" value="NUS" />
        <Picker.Item label="SMU" value="SMU" />
      </Picker>

      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Enter remarks here"
        value={remarks}
        onChangeText={setRemarks}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerTitle: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#7b4b52',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 5,
    marginBottom: 5,
  },
  chipText: {
    color: '#ffffff',
  },
  picker: {
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  textInput: {
    height: 100,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#7b4b52',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
