import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";

export default function Home() {
  const [username, setUsername] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();

  // In case the user signs out while on the page.
  if (!isLoaded || !isSignedIn) {
    console.log(`isLoaded: ${isLoaded}, isSignedIn: ${isSignedIn}`);
    router.replace("/sign-in");
  } else {
    console.log(`username: ${user.username}`);
    console.log(`userId: ${user.id}`);
    // setUsername(user.username as string);
  }

  const articles = [
    {
      id: 1,
      title:
        "Commentary: What will it take to eliminate dengue deaths in Singapore?",
      longdescription:
        "Singapore's fight against dengue remains challenging due to various factors like urbanization, climate change, and the adaptability of the Aedes mosquito. Despite extensive efforts in mosquito control and public awareness campaigns, dengue cases continue to surge periodically. The virus spreads more easily as warmer temperatures boost mosquito populations and breeding rates. Additionally, the mosquito has evolved to breed in smaller spaces and resist common insecticides, complicating eradication efforts and necessitating continuous adaptation in public health strategies.\n\nReferenced from: https://www.channelnewsasia.com/commentary/singapore-dengue-cases-deaths-outbreaks-why-difficult-eliminate-4639026",
      image: require("../../../assets/images/article1.png"),
    },
    {
      id: 2,
      title:
        "15 dengue deaths so far in 2024, more than double the six in whole of 2023: NEA",
      longdescription:
        "Singapore has reported 15 dengue-related deaths so far in 2024, over double the total in 2023, with 12,736 cases recorded to date. Despite a recent drop in cases, the NEA has identified 354 clusters and around 4,900 mosquito breeding sites, highlighting continued risks. The predominant virus strain is DENV-2, and transmission remains active in key areas like Jurong West and East. Public health measures encourage residents to reduce breeding habitats and use protective measures, as past outbreaks were fueled by warmer conditions and increased home exposure to mosquitoes.\n\n Referenced from: https://www.straitstimes.com/singapore/15-dengue-deaths-so-far-in-2024-more-than-double-in-whole-of-2023-nea ",
      image: require("../../../assets/images/article2.png"),
    },
    {
      id: 3,
      title: "Rise in dengue cases underscores need for constant vigilance",
      longdescription:
        "The rise in dengue cases in Singapore highlights the importance of continuous vigilance, especially given environmental factors conducive to mosquito breeding. Enhanced public awareness, early detection, and preventive actions are crucial in reducing transmission. Strategies include regular inspections to eliminate mosquito breeding sites, public education campaigns, and coordination with healthcare providers. By fostering community involvement and proactive healthcare measures, Singapore aims to mitigate the impact of dengue outbreaks. \n\n Referenced from: https://www.ncid.sg/Health-Professionals/Articles/Pages/Rise-in-dengue-cases-underscores-need-for-constant-vigilance.aspx",
      image: require("../../../assets/images/article3.png"),
    },
  ];

  const openArticle = (article: any) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
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
        <Image
          source={require("../../../assets/images/icon.png")}
          style={styles.headerImage}
        />
      </View>

      <View style={styles.welcomeSection}>
        <View style={styles.welcomeRow}>
          {<Text style={styles.welcomeText}>Welcome back, {username}!</Text>}
        </View>

        <Text style={styles.statusText}>Current Dengue Status:</Text>

        <View style={styles.statusBox}>
          <Text style={styles.status}>Positive</Text>
        </View>
        <TouchableOpacity style={styles.viewMoreButton}>
          <Text
            style={styles.viewMoreText}
            onPress={() => router.push("/(home)/viewMore")}
          >
            View More
          </Text>
        </TouchableOpacity>
        <Text style={styles.reportPrompt}>
          Have dengue? Report it so we can warn others
        </Text>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.push("/(home)/report_form")}
        >
          <Text style={styles.reportButtonText}>Report Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.articleSection}>
        <Text style={styles.header}>Explore Articles</Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {articles.map((article) => (
            <View key={article.id} style={styles.card}>
              <Image source={article.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{article.title}</Text>
              <TouchableOpacity
                onPress={() => openArticle(article)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>View Article</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {selectedArticle && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedArticle.title}</Text>
              <Image source={selectedArticle.image} style={styles.modalImage} />
              <Text style={styles.modalDescription}>
                {selectedArticle.longdescription}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    marginLeft: 170,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  viewArticleText: {
    color: "#ffffff",
    fontSize: 16,
  },

  scrollViewContent: {
    width: "100%",
    marginBottom: 20,
  },
  closeModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    marginBottom: 30,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
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

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tipsButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },

  scrollView: {
    flexDirection: "row",
  },
  card: {
    width: 250,
    marginRight: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    padding: 15,
    paddingLeft: 20,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 15,
    objectFit: "cover",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#7b4b52",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  modalContent: {
    width: "85%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    color: "#555",
    textAlign: "auto",
    marginBottom: 20,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#7b4b52",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
