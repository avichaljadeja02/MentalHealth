import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import axios from 'axios';

const Settings = ({ route }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const { userId } = route.params;

  const handleUpdate = () => {
    const apiUrl = `http://192.168.1.11:6969/updateDetails?uid=${userId}`;
    const updatedData = {};
    if (name) {
      updatedData.name = name;
    }
    if (dob) {
      updatedData.dob = dob;
    }
    if (phoneNumber) {
      updatedData.phoneNumber = phoneNumber;
    }
    if (address) {
      updatedData.address = address;
    }
    console.log(updatedData);
    axios.put(apiUrl, updatedData)
      .then(response => {
        console.log(response.data);
        alert("Updated Successfully!")
      })
      .catch(error => {
        console.error('Error updating user details:', error);
        // Handle error
      });
  };
  
  useEffect(() => {
    // Fetch user details from the API
    axios.get(`http://192.168.1.11:6969/getDetails?uid=${userId}`)
      .then(response => {
        const userDetails = response.data;
        console.log(userDetails)
        setName(userDetails.name);
        setDob(userDetails.dob);
        setPhoneNumber(userDetails.phoneNumber);
        setAddress(userDetails.address);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, []);

  const handleSave = () => {
    // Perform actions to save user profile data
    console.log('Name:', name);
    console.log('Date of Birth:', dob);
    console.log('Phone Number:', phoneNumber);
    console.log('Address:', address);
    handleUpdate()
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your date of birth"
        value={dob}
        onChangeText={text => setDob(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={text => setAddress(text)}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Settings;
