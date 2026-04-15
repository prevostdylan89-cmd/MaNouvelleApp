import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéPrice</Text>

      <TouchableOpacity style={[styles.card, styles.manualCard]} onPress={() => navigation.navigate('Scan')}>
        <Text style={styles.cardTitle}>✏️ Recherche manuelle</Text>
        <Text style={styles.cardDesc}>Entrez le nom et le numéro de la carte</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.cameraCard]} onPress={() => navigation.navigate('CameraScan')}>
        <Text style={styles.cardTitle}>📸 Scan par caméra</Text>
        <Text style={styles.cardDesc}>Prenez une photo de la carte</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.card, styles.historyCard]} onPress={() => navigation.navigate('SearchHistory')}>
        <Text style={styles.cardTitle}>📜 Historique des recherches</Text>
        <Text style={styles.cardDesc}>Retrouvez vos cartes consultées</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 50 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#e33535' },
  card: { borderRadius: 20, padding: 25, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  manualCard: { backgroundColor: '#4CAF50' },
  cameraCard: { backgroundColor: '#FF9800' },
  historyCard: { backgroundColor: '#9C27B0' },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  cardDesc: { fontSize: 14, color: 'white', opacity: 0.9 },
});