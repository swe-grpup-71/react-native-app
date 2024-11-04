import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Href, router} from 'expo-router';


export default function Details() {
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remarks, setRemarks] = useState('');
  const [symptoms, setSymptoms] = useState(['']);
  const [locations, setLocations] = useState(['']);

  const handleSymptomSelect = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const handleLocationSelect = (location: string) => {
    if (!locations.includes(location)) {
      setLocations([...locations, location]);
    }
  };

  const handleSymptomRemove = (symptom: string) => {
    setSymptoms(symptoms.filter(item => item !== symptom));
  };

  const handleLocationRemove = (location: string) => {
    setLocations(locations.filter(item => item !== location));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Please answer the questions below</Text>

      <Text style={styles.label}>Pick your symptoms:</Text>
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
      <Picker
        selectedValue={selectedSymptom}
        onValueChange={(itemValue) => {
          setSelectedSymptom(itemValue);
          handleSymptomSelect(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Pick a Symptom" value="" />
        <Picker.Item label="Fever" value="Fever" />
        <Picker.Item label="Chills" value="Chills" />
        <Picker.Item label="Headache" value="Headache" />
      </Picker>

      <Text style={styles.label}>Frequency Visit Locations:</Text>
      <View style={styles.chipContainer}>
        {locations.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chip}
            onPress={() => handleLocationRemove(location)}
          >
            <Text style={styles.chipText}>{location} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Picker
        selectedValue={selectedLocation}
        onValueChange={(itemValue) => {
          setSelectedLocation(itemValue);
          handleLocationSelect(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Pick a Location" value="" />
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

      <TouchableOpacity style={styles.submitButton} onPress={() =>  router.push('/submitted_thankyou')}>
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
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
