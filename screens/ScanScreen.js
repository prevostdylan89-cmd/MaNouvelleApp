import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { saveSearch } from '../services/historyService';
import { getEnglishName } from '../data/pokemonNames';

export default function ScanScreen({ navigation }) {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const searchCard = async () => {
    if (!name.trim() || !number.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du Pokémon et son numéro');
      return;
    }

    setLoading(true);
    try {
      const englishName = getEnglishName(name.trim());
      let cleanNumber = number.split('/')[0];
      cleanNumber = cleanNumber.replace(/^0+/, '');

      const query = `name:"${englishName}" number:${cleanNumber}`;
      const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();
      let cards = data.data || [];

      // Filtrer pour ne garder que les VRAIES cartes
      cards = cards.filter(card => 
        !card.name.toLowerCase().includes('box') &&
        !card.name.toLowerCase().includes('deck') &&
        !card.name.toLowerCase().includes('bundle') &&
        !card.name.toLowerCase().includes('collection') &&
        !card.name.toLowerCase().includes('blister') &&
        !card.name.toLowerCase().includes('checklane') &&
        card.supertype === 'Pokémon'
      );

      if (cards.length === 0) {
        Alert.alert('Aucune carte', `Aucune carte trouvée pour "${name.trim()}" numéro ${cleanNumber}`);
      } else if (cards.length === 1) {
        const card = cards[0];
        await saveSearch({ name: card.name, number: card.number, set: card.set.name });
        navigation.navigate('PriceDashboard', {
          cardName: card.name,
          cardNumber: card.number,
          cardSet: card.set.name,
        });
      } else {
        const options = cards.map(card => ({
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
      console.error(error);
      Alert.alert('Erreur', 'Problème de connexion à l\'API Pokémon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recherche manuelle</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du Pokémon (ex: Dracaufeu, Pikachu)"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de carte (ex: 25)"
        value={number}
        onChangeText={setNumber}
        keyboardType="numeric"
      />
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  searchButton: { backgroundColor: '#FF9800', padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
  backButton: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});