import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BLOCS } from '../constants';

export default function CollectionScreen({ navigation }) {
  const [blocsWithCount, setBlocsWithCount] = useState([]);

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

    const blocData = BLOCS.map(bloc => {
      let total = 0;
      bloc.editions.forEach(edition => {
        total += editionCountMap.get(edition) || 0;
      });
      return {
        name: bloc.name,
        count: total,
      };
    });

    setBlocsWithCount(blocData);
  };

  const renderBloc = ({ item }) => (
    <TouchableOpacity
      style={styles.blocCard}
      onPress={() => navigation.navigate('BlocEditions', { blocName: item.name })}
    >
      <Text style={styles.blocName}>{item.name}</Text>
      <Text style={styles.blocCount}>{item.count} carte(s)</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes collections</Text>
      <FlatList
        data={blocsWithCount}
        keyExtractor={item => item.name}
        renderItem={renderBloc}
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
  title: { fontSize: 32, fontWeight: 'bold', color: '#2196F3', textAlign: 'center', marginBottom: 20 },
  list: { paddingBottom: 20 },
  blocCard: {
    backgroundColor: '#2196F3',
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
  blocName: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 5 },
  blocCount: { fontSize: 16, color: 'white', opacity: 0.9 },
  back: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});