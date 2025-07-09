import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  useWindowDimensions,
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

export default function HomeScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [todayEntries, setTodayEntries] = useState([]);
  const [showMoodAlert, setShowMoodAlert] = useState(false);

  const handleAddEntry = () => {
    if (selectedMood) {
      navigation.navigate('NewEntry', { mood: selectedMood });
    } else {
      setShowMoodAlert(true);
    }
  };

  const handleMoodPress = (mood) => {
    if (selectedMood?.emoji === mood.emoji) {
      setSelectedMood(null);
    } else {
      setSelectedMood(mood);
    }
  };

  const loadTodayEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('entries');
      const parsed = stored ? JSON.parse(stored) : [];

      const today = new Date().toDateString();
      const filtered = parsed.filter(
        (entry) => new Date(entry.date).toDateString() === today
      );

      const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTodayEntries(sorted);
    } catch (error) {
      console.error('Failed to load today’s entries:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTodayEntries();
      setSelectedMood(null);
    });
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFD9C0' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Today’s Mood</Text>

        <View style={styles.moodsLabelContainer}>
          <Text style={styles.moodsLabel}>Moods</Text>

          {/* Scrollable Mood Container */}
          <ScrollView style={styles.moodScrollView}>
            {Object.entries(groupedMoods).map(([groupName, moods]) => (
              <View key={groupName} style={styles.moodGroup}>
                <Text style={styles.moodGroupLabel}>{groupName}</Text>
                <View style={styles.moodPicker}>
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood.emoji}
                      style={[
                        styles.moodPill,
                        selectedMood?.emoji === mood.emoji && styles.selectedPill,
                      ]}
                      onPress={() => handleMoodPress(mood)}
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

        <TouchableOpacity style={styles.entryButton} onPress={handleAddEntry}>
          <Text style={styles.entryButtonText}>Add Mood Entry</Text>
        </TouchableOpacity>

        <Text style={styles.recentTitle}>Today’s Journal Entries</Text>

        {todayEntries.length > 0 ? (
          todayEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => navigation.navigate('EntryDetail', { entry })}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryMoodTitle}>
                  {entry.mood} {entry.label}
                </Text>
                <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
              </View>
              <View style={styles.entryBody}>
                <Text style={styles.entryText}>
                  {entry.text.length > 100
                    ? entry.text.substring(0, 100) + '...'
                    : entry.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No journal entries yet for today.</Text>
        )}

        <Modal visible={showMoodAlert} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertText}>
                You have to select a mood first to Add Mood Entry
              </Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={() => setShowMoodAlert(false)}
              >
                <Text style={styles.alertButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: '5%',
    backgroundColor: '#FFD9C0',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  moodsLabelContainer: {
    backgroundColor: '#F8F1E5',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  moodsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  moodScrollView: {
    maxHeight: 280,
    width: '100%',
  },
  moodGroup: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  moodGroupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
    marginLeft: 8,
  },
  moodPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  moodPill: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    margin: 4,
  },
  selectedPill: {
    backgroundColor: '#FFE5B4',
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodText: {
    fontSize: 12,
    marginTop: 2,
    color: '#333',
  },
  entryButton: {
    backgroundColor: '#D1FADF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 24,
  },
  entryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#fff',
    alignSelf: 'flex-start',
  },
  entryCard: {
    backgroundColor: '#F29C7C',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  entryHeader: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  entryMoodTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  entryDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  entryBody: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  entryText: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
  },
  alertText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#FFD1A1',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});