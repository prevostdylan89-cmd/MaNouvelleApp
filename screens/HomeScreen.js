import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéCollection</Text>
      <TouchableOpacity style={[styles.card, styles.scanCard]} onPress={() => navigation.navigate('Scan')}>
        <Text style={styles.cardTitle}>📸 Scanner une carte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.card, styles.collectionCard]} onPress={() => navigation.navigate('Collection')}>
        <Text style={styles.cardTitle}>📚 Ma collection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 50 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#e33535' },
  card: { borderRadius: 20, padding: 25, marginBottom: 20, alignItems: 'center' },
  scanCard: { backgroundColor: '#4CAF50' },
  collectionCard: { backgroundColor: '#2196F3' },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
});