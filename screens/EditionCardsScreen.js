import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';

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
    const allCards = saved ? JSON.parse(saved) : [];
    const filtered = allCards.filter(card => card.set === edition);
    setCards(filtered);
  };

  const deleteCard = async (id) => {
    Alert.alert('Supprimer', 'Supprimer cette carte ?', [
      { text: 'Non' },
      {
        text: 'Oui',
        onPress: async () => {
          const saved = await AsyncStorage.getItem('cards');
          let allCards = saved ? JSON.parse(saved) : [];
          const cardToDelete = allCards.find(c => c.id === id);
          // Supprimer le fichier image local s'il existe
          if (cardToDelete && cardToDelete.imagePath) {
            try {
              const info = await FileSystem.getInfoAsync(cardToDelete.imagePath);
              if (info.exists) {
                await FileSystem.deleteAsync(cardToDelete.imagePath);
              }
            } catch (e) {
              console.warn('Erreur suppression fichier:', e);
            }
          }
          const newCards = allCards.filter(c => c.id !== id);
          await AsyncStorage.setItem('cards', JSON.stringify(newCards));
          loadCards(); // recharger la liste
        }
      }
    ]);
  };

  const renderCard = ({ item }) => {
    // Déterminer la source de l'image
    let imageSource = null;
    if (item.imagePath) {
      // Image locale
      imageSource = { uri: item.imagePath };
    } else if (item.imageUrl) {
      // Image distante (fallback)
      imageSource = { uri: item.imageUrl };
    }

    return (
      <View style={styles.card}>
        {imageSource ? (
          <Image source={imageSource} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.noImage]}>
            <Text style={styles.noImageText}>🎴</Text>
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardNumber}>N°{item.number}</Text>
          <TouchableOpacity onPress={() => deleteCard(item.id)}>
            <Text style={styles.deleteText}>🗑 Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
          renderItem={renderCard}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e33535',
    textAlign: 'center',
    marginBottom: 10,
  },
  count: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 80,
    height: 112,
    borderRadius: 8,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 40,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardNumber: {
    fontSize: 16,
    color: '#e33535',
    marginTop: 4,
  },
  deleteText: {
    color: '#e33535',
    marginTop: 10,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#e33535',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});