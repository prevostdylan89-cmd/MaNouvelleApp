import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BLOCS } from '../constants';

export default function BlocEditionsScreen({ route, navigation }) {
  const { blocName } = route.params;
  const [editionsWithCount, setEditionsWithCount] = useState([]);

  const bloc = BLOCS.find(b => b.name === blocName);
  const editionsList = bloc ? bloc.editions : [];

  useFocusEffect(
    useCallback(() => {
      loadCounts();
    }, [])
  );

  const loadCounts = async () => {
    const saved = await AsyncStorage.getItem('cards');
    const cards = saved ? JSON.parse(saved) : [];

    const editionCountMap = new Map();
    cards.forEach(card => {
      const edition = card.set;
      editionCountMap.set(edition, (editionCountMap.get(edition) || 0) + 1);
    });

    const data = editionsList.map(edition => ({
      name: edition,
      count: editionCountMap.get(edition) || 0,
    }));

    setEditionsWithCount(data);
  };

  const renderEdition = ({ item }) => (
    <TouchableOpacity
      style={styles.editionCard}
      onPress={() => navigation.navigate('EditionCards', { edition: item.name })}
    >
      <Text style={styles.editionName}>{item.name}</Text>
      <Text style={styles.editionCount}>{item.count} carte(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{blocName}</Text>
      <FlatList
        data={editionsWithCount}
        keyExtractor={item => item.name}
        renderItem={renderEdition}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#e33535', textAlign: 'center', marginBottom: 20 },
  list: { paddingBottom: 20 },
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
  editionName: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 5 },
  editionCount: { fontSize: 16, color: 'white', opacity: 0.9 },
  back: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});