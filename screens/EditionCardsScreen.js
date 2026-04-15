import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function EditionCardsScreen({ route, navigation }) {
  const { edition } = route.params;
  const [cards, setCards] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  const loadCards = async () => {
    const saved = await AsyncStorage.getItem('cards');
    if (saved) {
      const allCards = JSON.parse(saved);
      const filtered = allCards.filter(card => card.set === edition);
      setCards(filtered);
    }
  };

  const deleteCard = async (id) => {
    Alert.alert('Supprimer', 'Supprimer cette carte ?', [
      { text: 'Non' },
      {
        text: 'Oui',
        onPress: async () => {
          const saved = await AsyncStorage.getItem('cards');
          const allCards = JSON.parse(saved);
          const newCards = allCards.filter(c => c.id !== id);
          await AsyncStorage.setItem('cards', JSON.stringify(newCards));
          loadCards(); // Recharge la liste
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{edition}</Text>
      <Text style={styles.count}>{cards.length} carte(s)</Text>

      {cards.length === 0 ? (
        <Text style={styles.empty}>Aucune carte dans cette édition</Text>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.number}>N°{item.number}</Text>
                <TouchableOpacity onPress={() => deleteCard(item.id)}>
                  <Text style={styles.delete}>🗑 Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2196F3', textAlign: 'center', marginBottom: 10 },
  count: { textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 20 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#666' },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 10 },
  info: { flex: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  number: { fontSize: 16, color: '#e33535', marginTop: 4 },
  delete: { color: '#e33535', marginTop: 10, fontWeight: 'bold' },
  back: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});