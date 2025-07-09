import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JournalScreen({ navigation }) {
  const [entries, setEntries] = useState([]);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('entries');
      const parsed = stored ? JSON.parse(stored) : [];
      const sorted = parsed.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setEntries(sorted);
    } catch (error) {
      console.error('Failed to load journal entries', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadEntries);
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Journal Entries</Text>

        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No journal entries yet.</Text>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              onPress={() => navigation.navigate('EntryDetail', { entry })}
            >
              <View style={styles.datePill}>
                <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
              </View>
              <Text style={styles.moodText}>
                {entry.mood} {entry.label}
              </Text>
              <View style={styles.snippetBox}>
                <Text style={styles.snippetText}>
                  {entry.text.length > 60
                    ? entry.text.substring(0, 60) + ' …'
                    : entry.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFDACC',
  },
  container: {
    paddingHorizontal: '5%',
    paddingTop: 30, // 👈 pushes Journal Entries lower
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#FFDACC',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  entryCard: {
    backgroundColor: '#F4A987',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  datePill: {
    backgroundColor: '#FFE1D6',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#5C4B51',
    fontWeight: '600',
  },
  moodText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#fff',
  },
  snippetBox: {
    backgroundColor: '#FFDACC',
    borderRadius: 12,
    padding: 12,
  },
  snippetText: {
    fontSize: 15,
    color: '#3D2C29',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
});