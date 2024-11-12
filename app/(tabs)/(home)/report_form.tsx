import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';

export default function Details() {
  const [selectedSymptom, setSelectedSymptom] = useState<string[]>([]);
  const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');

  const symptomOptions = ['Fever', 'Chills', 'Headache',"Sorethroat","Vomiting","Rash"];
  const locationOptions = [
    "Angklong Ln (Faber Gdn Condo) / Island Gdns Walk / Sin Ming Ave (Flame Tree Pk) / Sin Ming Walk (Bishan Pk Condo, The Gdns at Bishan) / The Inglewood",
    "Buangkok Green, View",
    "Science Pk Dr",
    "Bishan St 22 (Blk 234) / Bishan St 23 (Blk 225, 229, 231) / Bishan St 24 (Blk 291) / Bishan St 25 (Clover By The Park)",
    "Cardiff Gr (Cardiff Residence) / Golden Dr, Walk / Jln Pacheli / Li Hwan Cl, Dr, View / Tai Hwan Ter",
    "Lentor Loop (Bullion Pk) / Lentor Lk, St, Ter",
    "Kreta Ayer Rd (Blk 334) / Sago Ln (Blk 4) / Smith St (Blk 335B)",
    "Tampines St 22 (Blk 295, 296, 297)",
    "Cactus Dr (Grande Vista)",
    "Ang Mo Kio Ave 1 (Blk 207, 217)",
    "Jln Tenteram (Blk 16)",
    "Lor 1 Toa Payoh (Blk 148, 149, 150, 153A, 155, 156, 157) / Lor 1 Toa Payoh (Oleander Twrs) / Lor 2 Toa Payoh (Blk 141, 142, 145, 146, 147, 152, 153, 154)",
    "Pasir Ris Dr 10 (Blk 645, 647)",
    "Seletar North Lk",
    "Tuas South St 12",
    "Eng Kong Rd, Ter / Lor Kismis / Toh Tuck Rd / Toh Tuck Rd (Daintree Residence, Nottinghill Suites, The Creek @ Bt) / Toh Tuck Ter / Toh Yi Rd",
    "Toh Tuck Rd / Toh Tuck Rd (Signature Pk)",
    "Tai Hwan Cres",
    "Lor 1 Toa Payoh (Blk 158, 159, 160, 161, 163, 168, 169, 170, 171, 173, 174) / Lor 1 Toa Payoh (Trellis Twrs) / Thomson Ln (Sky@Eleven)",
    "Lor 1 Toa Payoh (Blk 98) / Lor 2 Toa Payoh (Blk 99B, 99C, 101A, 101B) / Lor 3 Toa Payoh (Blk 91, 96, 97) / Lor 3 Toa Payoh (Trevista) / Lor 4 Toa Payoh (Blk 94)",
    "Bt Batok West Ave 6 (Blk 450C, 451A)",
    "Bt Batok East Ave 4 (Blk 271, 272)",
    "Bedok North Ave 2 (Blk 514, 518)",
    "Rivervale Cres (Blk 151, 185D)",
    "Upp S'goon View (The Kingsford Waterbay)",
    "Lor 1 Toa Payoh (Blk 128) / Lor 1A Toa Payoh (Blk 138A, 138B, 138C, 139A, 139B) / Lor 2 Toa Payoh (Blk 143, 144)",
    "Choa Chu Kang Ave 3 (Mi Casa, The Rainforest)",
    "Keng Lee Rd (Rochelle At Newton) / Newton Rd (Amaryllis Ville)",
    "Bt Batok West Ave 6 (Blk 185, 186, 193)",
    "Redhill Rd (Blk 71, 73A, 75B)",
    "Old Choa Chu Kang Rd",
    "Lor Ong Lye / S'goon Ave 1 (Blk 425) / S'goon Ter",
    "Bt Batok St 52 (Blk 539) / Bt Batok St 52 (Guilin View)",
    "Holland Dr (Blk 18A, 18B)",
    "Lor 1 Toa Payoh (Blk 117, 118, 119, 123) / Lor 2 Toa Payoh (Blk 116, 120, 121, 122)",
    "Akyab Rd (Pavilion 11) / Mandalay Rd (The Ansley) / Prome Rd",
    "Lor 2 Toa Payoh (Blk 84) / Lor 4 Toa Payoh (Blk 80)",
    "Lor 1 Toa Payoh (Blk 107, 111, 113, 114) / Toa Payoh North (Blk 206, 207)",
    "Bendemeer Rd / Bendemeer Rd (Blk 32) / Mcnair Rd (Blk 113A, 113C) / Towner Rd (Blk 105) / Whampoa West (Blk 34)",
    "S'goon Ctrl Dr (Blk 256, 258)",
    "Ang Mo Kio Ave 2 / Thomson Green, Walk",
    "Chancery Ln / Gentle Rd / Gilstead Rd"
  ];

  const handleSymptomSelect = (symptom: string) => {
    if (!selectedSymptom.includes(symptom)) {
      setSelectedSymptom([...selectedSymptom, symptom]);
    }
    setShowSymptomDropdown(false);
  };

  const handleSymptomRemove = (symptom: string) => {
    setSelectedSymptom(selectedSymptom.filter(item => item !== symptom));
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = locationOptions.filter(loc => loc.toLowerCase().includes(text.toLowerCase()));
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleLocationSelect = (location: string) => {
    if (!selectedLocation.includes(location)) {
      setSelectedLocation([...selectedLocation, location]);
    }
    setSearchQuery(''); // Clear the input field after selection
    setFilteredLocations([]); // Clear the dropdown list
    setShowLocationDropdown(false);
  };

  const handleLocationRemove = (location: string) => {
    setSelectedLocation(selectedLocation.filter(item => item !== location));
  };

  const handleSubmit = async () => {
    const payload = {
      userId: '12345', // Replace this with the actual user ID, ideally fetched dynamically
      symptoms: selectedSymptom,
      locations: selectedLocation.map(location => ({
        name: location,
        coordinates: {
          latitude: 0, // Replace with actual latitude if available
          longitude: 0 // Replace with actual longitude if available
        }
      })),
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Please answer the questions below</Text>

      <Text style={styles.label}>Pick your symptoms:</Text>
      {selectedSymptom.length > 0 && (
        <View style={styles.chipContainer}>
          {selectedSymptom.map((symptom, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => handleSymptomRemove(symptom)}>
              <Text style={styles.chipText}>{symptom} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setShowSymptomDropdown(!showSymptomDropdown)}
      >
        <Text style={styles.triggerText}>
          {selectedSymptom.length > 0 ? 'Add more symptoms' : 'Select symptoms'}
        </Text>
      </TouchableOpacity>
      {showSymptomDropdown && (
        <FlatList
          data={symptomOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSymptomSelect(item)} style={styles.listItem}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdownList}
        />
      )}

      <Text style={styles.label}>Frequently Visited Locations:</Text>
      {selectedLocation.length > 0 && (
        <View style={styles.chipContainer}>
          {selectedLocation.map((location, index) => (
            <TouchableOpacity key={index} style={styles.chip} onPress={() => handleLocationRemove(location)}>
              <Text style={styles.chipText}>{location} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TextInput
        style={styles.searchInput}
        placeholder="Search locations..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        onFocus={() => setShowLocationDropdown(true)}
      />
      {showLocationDropdown && filteredLocations.length > 0 && (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleLocationSelect(item)} style={styles.listItem}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.dropdownList}
        />
      )}

      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={[styles.textInput, { height: 100 }]}
        multiline
        placeholder="Enter remarks here"
        value={remarks}
        onChangeText={setRemarks}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
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
  dropdownTrigger: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  triggerText: {
    fontSize: 16,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 150,
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textInput: {
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