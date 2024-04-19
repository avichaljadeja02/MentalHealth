import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import axios from 'axios';

const PositiveReinforcementScreen = () => {
  const [reinforcements, setReinforcements] = useState([]);

  useEffect(() => {
    async function fetchReinforcements() {
      try {
        const response = await axios.get('http://192.168.1.11:6969/getReinforcement');
        console.log(response.data)
        if(response.data.reinforcements)
          setReinforcements(response.data.reinforcements);
      } catch (error) {
        console.error('Error fetching reinforcements:', error);
      }
    }
    
    fetchReinforcements();
  }, []);

  const handleShare = async () => {
    try {
      const sharedContent = Object.values(reinforcements).join('\n'); // Join the positive reinforcements as a single string
      await Share.share({
        message: sharedContent,
      });
    } catch (error) {
      console.log('Error sharing:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Positive Reinforcement</Text>

      <Text style={styles.sectionTitle}>3 Bullet Points:</Text>
      {Object.keys(reinforcements).map((key, index) => (
        <Text key={index} style={styles.bulletPoint}>
          {reinforcements[key]}
        </Text>
      ))}

      <View style={styles.whyDoThisSection}>
        <Text style={styles.sectionTitle}>Why do this?</Text>
        <Text style={styles.description}>
          Importance of finding value beyond appearance and taking control of dysmorphia.
        </Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    marginBottom: 8,
  },
  whyDoThisSection: {
    marginVertical: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default PositiveReinforcementScreen;
