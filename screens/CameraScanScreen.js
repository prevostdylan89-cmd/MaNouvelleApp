import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { saveSearch } from '../services/historyService';
import { getEnglishName } from '../data/pokemonNames';

export default function CameraScanScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [pokemonName, setPokemonName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de la caméra pour scanner les cartes.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPokemonName('');
      setCardNumber('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPokemonName('');
      setCardNumber('');
    }
  };

  const searchCard = async () => {
    let cleanNumber = cardNumber.split('/')[0];
    cleanNumber = cleanNumber.replace(/^0+/, '');
    const nameTrimmed = pokemonName.trim();
    if (!nameTrimmed || !cleanNumber) {
      Alert.alert('Erreur', 'Entrez le nom et le numéro');
      return;
    }
    setLoading(true);
    try {
      const englishName = getEnglishName(nameTrimmed);
      const query = `name:"${englishName}" number:${cleanNumber}`;
      const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url);
      const cards = response.data.data;
      if (cards.length === 0) {
        Alert.alert('Aucune carte', `Aucune carte trouvée pour "${nameTrimmed}" (recherché: ${englishName}) n°${cleanNumber}`);
      } else if (cards.length === 1) {
        const card = cards[0];
        await saveSearch({ name: card.name, number: card.number, set: card.set.name });
        navigation.navigate('PriceDashboard', {
          cardName: card.name,
          cardNumber: card.number,
          cardSet: card.set.name,
        });
      } else {
        const options = cards.slice(0, 5).map(card => ({
          text: `${card.name} - ${card.set.name}`,
          onPress: async () => {
            await saveSearch({ name: card.name, number: card.number, set: card.set.name });
            navigation.navigate('PriceDashboard', {
              cardName: card.name,
              cardNumber: card.number,
              cardSet: card.set.name,
            });
          }
        }));
        Alert.alert('Plusieurs cartes trouvées', 'Choisissez la bonne carte :', options);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Problème de connexion à l\'API Pokémon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Scan par caméra</Text>
      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📷 Prendre une photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImage}>
        <Text style={styles.buttonText}>🖼️ Choisir dans la galerie</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}

      <Text style={styles.label}>Nom du Pokémon (en français)</Text>
      <TextInput style={styles.input} placeholder="Ex: Dracaufeu, Pikachu" value={pokemonName} onChangeText={setPokemonName} autoCapitalize="words" />

      <Text style={styles.label}>Numéro sur la carte</Text>
      <TextInput style={styles.input} placeholder="Ex: 25" value={cardNumber} onChangeText={setCardNumber} keyboardType="default" />

      <TouchableOpacity style={styles.searchButton} onPress={searchCard} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Recherche...' : '🔍 Analyser les prix'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  galleryButton: { backgroundColor: '#2196F3' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  preview: { width: '100%', height: 250, borderRadius: 10, marginVertical: 20, resizeMode: 'contain' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  searchButton: { backgroundColor: '#FF9800', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 20 },
  backButton: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
});