import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EntryDetailScreen({ route, navigation }) {
  const { entry } = route.params;
  const [text, setText] = useState(entry.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      const stored = await AsyncStorage.getItem('entries');
      const parsed = stored ? JSON.parse(stored) : [];

      const updated = parsed.map((e) =>
        e.id === entry.id ? { ...e, text } : e
      );

      await AsyncStorage.setItem('entries', JSON.stringify(updated));
      setIsEditing(false);
      navigation.goBack(); // return after save
    } catch (error) {
      console.error('Failed to save entry', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem('entries');
            const parsed = stored ? JSON.parse(stored) : [];

            const filtered = parsed.filter((e) => e.id !== entry.id);
            await AsyncStorage.setItem('entries', JSON.stringify(filtered));
            navigation.goBack();
          } catch (error) {
            console.error('Failed to delete entry', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>

      {/* Date */}
      <Text style={styles.date}>{new Date(entry.date).toDateString()}</Text>

      {/* Mood */}
      <View style={styles.moodRow}>
        <Text style={styles.emoji}>{entry.mood}</Text>
        <Text style={styles.label}>{entry.label}</Text>
      </View>

      {/* Entry Content */}
      {isEditing ? (
        <TextInput
          style={styles.input}
          multiline
          value={text}
          onChangeText={setText}
        />
      ) : (
        <View style={styles.textBox}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                setText(entry.text);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDCD1',
    padding: 20,
  },
  backButton: {
    backgroundColor: '#F9B29D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 18,
    color: '#6B3E2E',
  },
  date: {
    fontSize: 14,
    color: '#6B3E2E',
    marginTop: 10,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  emoji: {
    fontSize: 30,
    marginRight: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6B3E2E',
  },
  textBox: {
    backgroundColor: '#F6B495',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    minHeight: 200,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#5B3E2E',
  },
  input: {
    backgroundColor: '#F6B495',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    fontSize: 16,
    minHeight: 200,
    textAlignVertical: 'top',
    color: '#5B3E2E',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
  },
  editButton: {
    backgroundColor: '#F9B29D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: '#C84630',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#FEC87C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#F9B29D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  editText: {
    color: '#6B3E2E',
    fontWeight: '600',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    color: '#6B3E2E',
    fontWeight: '600',
  },
  saveText: {
    color: '#6B3E2E',
    fontWeight: '600',
  },
});