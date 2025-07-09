import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  UIManager,
  LayoutAnimation,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const [showAbout, setShowAbout] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = async () => {
    try {
      await AsyncStorage.removeItem('entries');
      Alert.alert('Data Cleared', 'All entries have been removed.');
    } catch (error) {
      console.error('Failed to clear data', error);
    }
    setShowConfirm(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {!showAbout && (
          <>
            <Text style={styles.heading}>Settings</Text>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setShowConfirm(true)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Clear All Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.aboutButton}
              onPress={() => setShowAbout(true)}
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#fff"
                style={styles.icon}
              />
              <Text style={styles.buttonText}>About the App</Text>
            </TouchableOpacity>
          </>
        )}

        {/* About the App Screen */}
        {showAbout && (
          <ScrollView contentContainerStyle={styles.aboutContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowAbout(false)}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
              <Text style={styles.backText}>About the App</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>About MindMate</Text>
            <Text style={styles.paragraph}>Version: 1.1.1</Text>
            <Text style={styles.paragraph}>Release Date: May 2025</Text>
            <Text style={styles.paragraph}>Last Updated: June 29, 2025</Text>
            <Text style={styles.paragraph}>
              Platform Compatibility: Android · Web · Expo Go
            </Text>

            <Text style={styles.paragraph}>
              MindMate is your personal mental wellness tracker — designed to help you reflect,
              grow, and gain clarity through daily mood logs, private journaling, and inspiring quotes.
            </Text>

            <Text style={styles.paragraph}>
              Whether you're managing stress, tracking emotional patterns, or simply staying mindful,
              MindMate makes it easy with a minimal, calming interface.
            </Text>

            <Text style={styles.sectionTitle}>Features</Text>
            <Text style={styles.bullet}>• Daily mood tracking with simple emoji selection</Text>
            <Text style={styles.bullet}>• Secure, private journal entries</Text>
            <Text style={styles.bullet}>• Mood history to visualize emotional patterns</Text>
            <Text style={styles.bullet}>• Offline support via local storage</Text>
            <Text style={styles.bullet}>• Clean and minimalist design</Text>

            <Text style={styles.sectionTitle}>Privacy</Text>
            <Text style={styles.paragraph}>
              Your data stays on your device. MindMate does not collect or share personal information.
              You have full control over your entries and can delete them anytime.
            </Text>

            <Text style={styles.sectionTitle}>Built With</Text>
            <Text style={styles.bullet}>• React Native (Expo)</Text>
            <Text style={styles.bullet}>• AsyncStorage</Text>
            <Text style={styles.bullet}>• React Navigation</Text>

            <Text style={styles.sectionTitle}>Created By</Text>
            <Text style={styles.paragraph}>
              This app was built as a student project to demonstrate mobile development skills using modern tools and best practices.
            </Text>
          </ScrollView>
        )}

        {/* Confirm Clear Modal */}
        <Modal transparent={true} animationType="fade" visible={showConfirm}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>Are you sure you want to clear all data?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowConfirm(false)}>
                  <Text style={styles.modalButton}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearData}>
                  <Text style={styles.modalButton}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFD8C2',
  },
  container: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: 30, 
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#F4A78E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutButton: {
    backgroundColor: '#F4A78E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aboutContent: {
    paddingHorizontal: '5%',
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFD8C2',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  bullet: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    marginBottom: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  modalButton: {
    fontSize: 16,
    color: '#F08080',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
});