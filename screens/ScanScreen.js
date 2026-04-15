import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_EDITIONS } from '../constants';

// Trier les éditions par ordre alphabétique
const SORTED_EDITIONS = [...ALL_EDITIONS].sort((a, b) => a.localeCompare(b));

export default function ScanScreen({ navigation }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [selectedEdition, setSelectedEdition] = useState(SORTED_EDITIONS[0]);
  const [saving, setSaving] = useState(false);

  const saveCard = async () => {
    if (!name || !number) {
      Alert.alert('Erreur', 'Remplissez le nom et le numéro');
      return;
    }

    setSaving(true);
    try {
      const existing = await AsyncStorage.getItem('cards');
      let cards = existing ? JSON.parse(existing) : [];

      cards.push({
        id: Date.now().toString(),
        name: name,
        number: number,
        set: selectedEdition,
        date: new Date().toISOString(),
      });

      await AsyncStorage.setItem('cards', JSON.stringify(cards));

      Alert.alert('Succès', 'Carte ajoutée', [{ text: 'OK', onPress: () => {
        setName('');
        setNumber('');
        navigation.goBack();
      }}]);
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajouter une carte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du Pokémon"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Numéro"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Édition :</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedEdition}
          onValueChange={(itemValue) => setSelectedEdition(itemValue)}
          style={styles.picker}
        >
          {SORTED_EDITIONS.map((edition) => (
            <Picker.Item key={edition} label={edition} value={edition} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveCard} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Sauvegarde...' : '💾 Sauvegarder'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  pickerContainer: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginBottom: 20 },
  picker: { height: 50, width: '100%' },
  saveButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  backButton: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 15 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});