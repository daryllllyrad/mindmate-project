import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const groupedMoods = {
  Positive: [
    { emoji: '🥰', label: 'Loved' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '🥳', label: 'Excited' },
    { emoji: '😌', label: 'Relaxed' },
    { emoji: '🤩', label: 'Grateful' },
    { emoji: '😇', label: 'Hopeful' },
  ],
  Neutral: [
    { emoji: '😶', label: 'Neutral' },
    { emoji: '😐', label: 'Meh' },
    { emoji: '🤔', label: 'Confused' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😶‍🌫️', label: 'Numb' },
    { emoji: '😷', label: 'Sick' },
  ],
  Negative: [
    { emoji: '😔', label: 'Sad' },
    { emoji: '😟', label: 'Anxious' },
    { emoji: '😤', label: 'Frustrated' },
    { emoji: '😠', label: 'Angry' },
    { emoji: '😢', label: 'Heartbroken' },
    { emoji: '😩', label: 'Overwhelmed' },
  ],
};

export default function NewEntryScreen({ route, navigation }) {
  const [selectedMood, setSelectedMood] = useState(route.params?.mood || null);
  const [entryText, setEntryText] = useState('');

  const handleSave = async () => {
    if (!selectedMood || !entryText.trim()) {
      Alert.alert('Missing Fields', 'Please select a mood and write something.');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood.emoji,
      label: selectedMood.label,
      text: entryText.trim(),
    };

    try {
      const existing = await AsyncStorage.getItem('entries');
      const entries = existing ? JSON.parse(existing) : [];
      entries.unshift(newEntry);
      await AsyncStorage.setItem('entries', JSON.stringify(entries));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Entry</Text>

      <View style={styles.moodSelectorCard}>
        <Text style={styles.moodLabel}>Select Mood</Text>
        <ScrollView style={{ maxHeight: 250 }}>
          {Object.entries(groupedMoods).map(([group, moods]) => (
            <View key={group} style={styles.moodGroup}>
              <Text style={styles.moodGroupLabel}>{group}</Text>
              <View style={styles.moodPicker}>
                {moods.map((mood) => (
                  <TouchableOpacity
                    key={mood.emoji}
                    style={[
                      styles.moodPill,
                      selectedMood?.emoji === mood.emoji && styles.selectedPill,
                    ]}
                    onPress={() => setSelectedMood(mood)}
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodText}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.inputLabel}>Journal Entry</Text>
      <TextInput
        style={styles.input}
        placeholder="Write something…"
        placeholderTextColor="#999"
        value={entryText}
        onChangeText={setEntryText}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFD9C0',
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  moodSelectorCard: {
    backgroundColor: '#FFF4E6',
    borderRadius: 20,
    padding: 12,
    marginBottom: 24,
    maxHeight: 300,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  moodGroup: {
    marginBottom: 12,
  },
  moodGroupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginLeft: 8,
    marginBottom: 6,
  },
  moodPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  moodPill: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    margin: 4,
  },
  selectedPill: {
    backgroundColor: '#FFD1A1',
  },
  moodEmoji: {
    fontSize: 22,
  },
  moodText: {
    fontSize: 12,
    color: '#333',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#FFF4D6',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});