import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory, clearHistory } from '../services/historyService';

export default function SearchHistoryScreen({ navigation }) {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleClear = () => {
    Alert.alert('Effacer historique', 'Supprimer toutes les recherches ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Oui', onPress: async () => {
          await clearHistory();
          loadHistory();
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('PriceDashboard', {
        cardName: item.name,
        cardNumber: item.number,
        cardSet: item.set,
      })}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>N°{item.number} - {item.set}</Text>
      <Text style={styles.itemDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Historique des recherches</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>Aucune recherche récente</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
        <Text style={styles.clearButtonText}>🧹 Effacer tout l'historique</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2196F3', textAlign: 'center', marginBottom: 20 },
  list: { paddingBottom: 20 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#666' },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemDetails: { fontSize: 14, color: '#666', marginTop: 4 },
  itemDate: { fontSize: 12, color: '#999', marginTop: 4 },
  clearButton: {
    backgroundColor: '#e33535',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  clearButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  backButton: {
    backgroundColor: '#e33535',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});