import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function CollectionScreen({ navigation }) {
  const [editions, setEditions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadEditions();
    }, [])
  );

  const loadEditions = async () => {
    try {
      const saved = await AsyncStorage.getItem('cards');
      const cards = saved ? JSON.parse(saved) : [];
      const map = new Map();
      cards.forEach(card => {
        const edition = card.set;
        map.set(edition, (map.get(edition) || 0) + 1);
      });
      const list = Array.from(map.entries()).map(([name, count]) => ({ name, count }));
      setEditions(list);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les cartes');
    }
  };

  const debugData = async () => {
    const saved = await AsyncStorage.getItem('cards');
    Alert.alert('Données brutes', saved || 'Aucune carte dans AsyncStorage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes collections</Text>
      
      <TouchableOpacity style={styles.debugButton} onPress={debugData}>
        <Text style={styles.debugButtonText}>🔍 Debug (voir données brutes)</Text>
      </TouchableOpacity>

      {editions.length === 0 ? (
        <Text style={styles.emptyText}>Aucune édition pour le moment. Scannez des cartes !</Text>
      ) : (
        <FlatList
          data={editions}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.editionCard}
              onPress={() => navigation.navigate('EditionCards', { edition: item.name })}
            >
              <Text style={styles.editionName}>{item.name}</Text>
              <Text style={styles.editionCount}>{item.count} carte(s)</Text>
            </TouchableOpacity>
          )}
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 20,
  },
  debugButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  debugButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#666',
  },
  editionCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editionName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  editionCount: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
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