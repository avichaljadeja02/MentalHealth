import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from './firebaseConfig';

const InsideLayout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      FIREBASE_AUTH.signOut()
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error while logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Page</Text>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.linkText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Goals')}
      >
        <Text style={styles.linkText}>Goals</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Positive Reinforcement')}
      >
        <Text style={styles.linkText}>Positive Reinforcement</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Journal Page')}
      >
        <Text style={styles.linkText}>Journals</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  linkText: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutButtonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default InsideLayout;
