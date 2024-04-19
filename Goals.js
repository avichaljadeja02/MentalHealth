import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const Goals = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [goalDescription, setGoalDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const { userId } = route.params;
  const [todayGoals, setToday] = useState([]);
  const [weekGoals, setWeeks] = useState([]);
  const [monthGoals, setMonths] = useState([]);
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));

    return date >= startOfWeek && date <= endOfWeek;
  };

  const isThisMonth = (date) => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return date >= startOfMonth && date <= endOfMonth;
  };


  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://192.168.1.11:6969/getgoals?uid=${userId}`);

      if (response.status === 200) {
        const goals = response.data.goals;
        const todayGoals = [];
        const weekGoals = [];
        const monthGoals = [];


        goals.forEach(goal => {
          const dueDate = new Date(goal.reminderDate);

          if (isToday(dueDate)) {
            todayGoals.push(goal);
          } else if (isThisWeek(dueDate)) {
            weekGoals.push(goal);
          } else if (isThisMonth(dueDate)) {
            monthGoals.push(goal);
          }
        });

        setToday(todayGoals);
        setWeeks(weekGoals);
        setMonths(monthGoals);
      } else {
        console.log('Error fetching goals:', response.data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setGoalDescription('');
    setShow(false);
    setDate(new Date());
  };

  const addGoal = async () => {
    try {
      const response = await axios.post('http://192.168.1.11:6969/addgoal', {
        uid: userId,
        goal: goalDescription,
        date: date.toISOString(),
      });

      if (response.status === 200) {
        console.log('Goal added successfully:', response.data);
        fetchGoals()
        closeModal();
      } else {
        console.log('Error adding goal:', response.data);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Goals Tracker</Text>

      <View style={styles.goalsContainer}>
        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          {todayGoals.map((goal, index) => (
            <Text key={index} style={styles.goalText}>
            {goal.goal}
            </Text>
          ))}
        </View>

        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>This Week's Goals</Text>
          {weekGoals.map((goal, index) => (
            <Text key={index} style={styles.goalText}>
              {goal.goal} - Complete by: {new Date(goal.reminderDate).toLocaleDateString()}
            </Text>
          ))}
        </View>

        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>This Month's Goals</Text>
          {monthGoals.map((goal, index) => (
            <Text key={index} style={styles.goalText}>
              {goal.goal} - Complete by: {new Date(goal.reminderDate).toLocaleDateString()}
            </Text>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openModal}>
        <Text style={styles.addButtonText}>Add Goal</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Goal</Text>
          <TextInput
            style={styles.goalInput}
            placeholder="Enter goal description"
            value={goalDescription}
            onChangeText={text => setGoalDescription(text)}
          />
          <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
            <Text style={styles.dateButtonText}>Select Due Date</Text>
          </TouchableOpacity>
          <Text style={styles.selectedDateText}>Selected Date: {date.toLocaleString()}</Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <View style={styles.buttonContainer}>
            <Button title="Add" onPress={addGoal} />
            <Button title="Cancel" onPress={closeModal} />
          </View>
        </View>
      </Modal>
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
    goalsContainer: {
      flex: 1,
    },
    goalSection: {
      marginBottom: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 15,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    goalText: {
      fontSize: 16,
      marginBottom: 5,
    },
    addButton: {
      backgroundColor: 'blue',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      alignSelf: 'center',
      elevation: 3,
    },
    addButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },  
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  goalInput: {
    width: '80%',
    marginBottom: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  dateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  dateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedDateText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default Goals;
