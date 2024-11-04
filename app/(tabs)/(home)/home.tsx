import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Image  } from "react-native";
import { router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {

  const [modalVisible, setModalVisible] = useState(false);

  const [modalVisible2, setModalVisible2] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    fetchUsername();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>BuzzTracker</Text>
        <Image source={require('../../../assets/images/icon.png')} style={styles.headerImage} />
      </View>

      <View style={styles.welcomeSection}>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Welcome back, {username}!</Text>
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
        <TouchableOpacity style={styles.viewArticleButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.viewArticleText}>View Article</Text>
        </TouchableOpacity>

        <Text style={styles.articleText}>Article #2</Text>
        <TouchableOpacity style={styles.viewArticleButton} onPress={() => setModalVisible2(true)}>
          <Text style={styles.viewArticleText}>View Article</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}> Commentary: What will it take to eliminate dengue deaths in Singapore?</Text>
            <ScrollView style={styles.scrollViewContent}>
              <Text style={styles.modalContent}>
                Singapore's fight against dengue remains challenging due to various factors like urbanization, climate change, and the adaptability of the Aedes mosquito. Despite extensive efforts in mosquito control and public awareness campaigns, dengue cases continue to surge periodically. The virus spreads more easily as warmer temperatures boost mosquito populations and breeding rates. Additionally, the mosquito has evolved to breed in smaller spaces and resist common insecticides, complicating eradication efforts and necessitating continuous adaptation in public health strategies.
                
                {'\n\n'} Referenced from: https://www.channelnewsasia.com/commentary/singapore-dengue-cases-deaths-outbreaks-why-difficult-eliminate-4639026
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => setModalVisible2(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>15 dengue deaths so far in 2024, more than double the six in whole of 2023: NEA</Text>
            <Text style={styles.modalContent}>
              Singapore has reported 15 dengue-related deaths so far in 2024, over double the total in 2023, with 12,736 cases recorded to date. Despite a recent drop in cases, the NEA has identified 354 clusters and around 4,900 mosquito breeding sites, highlighting continued risks. The predominant virus strain is DENV-2, and transmission remains active in key areas like Jurong West and East. Public health measures encourage residents to reduce breeding habitats and use protective measures, as past outbreaks were fueled by warmer conditions and increased home exposure to mosquitoes.
              
              {'\n\n'} Referenced from: https://www.straitstimes.com/singapore/15-dengue-deaths-so-far-in-2024-more-than-double-in-whole-of-2023-nea 
            </Text>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setModalVisible2(false)}>
                <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
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
  headerImage: {
    width: 40,
    height: 40,
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
  viewArticleButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    marginBottom: 30,
  },
  viewArticleText: {
    color: "#ffffff",
    fontSize: 16,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  scrollViewContent: {
    width: '100%',       
    marginBottom: 20,
  },
  closeModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    marginBottom: 30,
  },
  closeModalButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },

  tipsButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    marginBottom: 30,
  },
  tipsButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
