import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Share } from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

const JournalPage = ({ route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [journalEntry, setJournalEntry] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const { userId } = route.params;
    const [journals, setJournals] = useState([]);

    const fetchJournals = async () => {
        try {
            const response = await axios.get(`http://192.168.1.11:6969/getjournals?uid=${userId}`);

            if (response.status === 200) {
                setJournals(response.data.journals);
            } else {
                console.log('Error fetching journals:', response.data);
            }
        } catch (error) {
            console.error('Error fetching journals:', error);
        }
    };

    const addJournal = async () => {
        try {
            const response = await axios.post('http://192.168.1.11:6969/addjournals', {
                uid: userId,
                entry: journalEntry,
                emoji: selectedEmoji,
            });

            if (response.status === 200) {
                console.log('Journal entry added successfully:', response.data);
                fetchJournals();
                closeModal();
            } else {
                console.log('Error adding journal entry:', response.data);
            }
        } catch (error) {
            console.error('Error adding journal entry:', error);
        }
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setJournalEntry('');
        setSelectedEmoji('');
    };

    const shareJournal = async (entry) => {
        try {
            const shareContent = {
                message: `Sharing a journal from my app:\nJournal Entry: ${entry.entry}\n Associated Emoji: ${entry.emoji}`,
            };
            const result = await Share.share(shareContent);

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Journal shared successfully');
                } else {
                    console.log('Journal sharing cancelled');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Journal sharing dismissed');
            }
        } catch (error) {
            console.error('Error sharing journal:', error.message);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Journals</Text>
            {journals.map((entry) => (
                <View key={entry.id} style={styles.journalEntry}>
                    <View style={styles.journalContent}>
                        <Text style={styles.journalText}>{entry.entry}</Text>
                        <Text style={styles.journalEmoji}>Emoji: {entry.emoji}</Text>
                    </View>
                    <TouchableOpacity onPress={() => shareJournal(entry)}>
                        <Feather name="share" size={24} color="black" style={styles.shareButton} />
                    </TouchableOpacity>
                </View>
            ))}

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Add Journal Entry</Text>
                    <TextInput
                        style={styles.journalInput}
                        placeholder="Enter journal entry"
                        value={journalEntry}
                        onChangeText={(text) => setJournalEntry(text)}
                        multiline
                    />
                    <TextInput
                        style={styles.emojiInput}
                        placeholder="Enter emoji"
                        value={selectedEmoji}
                        onChangeText={(text) => setSelectedEmoji(text)}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Add" onPress={addJournal} />
                        <Button title="Cancel" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.addButton} onPress={openModal}>
                <Text style={styles.addButtonText}>Add Journal Entry</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    journalEntry: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    journalContent: {
        flex: 1,
    },
    journalText: {
        fontSize: 16,
    },
    journalEmoji: {
        fontSize: 14,
        color: 'gray',
    },
    shareButton: {
        marginLeft: 10,
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
    journalInput: {
        width: '80%',
        marginBottom: 20,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    emojiInput: {
        width: '80%',
        marginBottom: 20,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
});

export default JournalPage;
