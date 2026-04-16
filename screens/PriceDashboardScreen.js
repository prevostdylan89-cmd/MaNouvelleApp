import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { fetchEbayPriceData } from '../services/ebayApi';

const { width: screenWidth } = Dimensions.get('window');

export default function PriceDashboardScreen({ route, navigation }) {
  const { cardName, cardNumber, cardSet } = route.params;
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setLoading(true);
        const data = await fetchEbayPriceData(cardName, cardNumber, cardSet);
        setPriceData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };
    loadPriceData();
  }, [cardName, cardNumber, cardSet]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e33535" />
        <Text style={styles.loadingText}>Analyse des prix en cours...</Text>
      </View>
    );
  }

  const hasPrices = priceData && priceData.results > 0 && priceData.average_price > 0;
  const hasImage = priceData && priceData.imageUrl;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Analyse des prix</Text>
      
      {/* Affichage de l'image de la carte */}
      <View style={styles.cardInfoContainer}>
        {hasImage ? (
          <Image 
            source={{ uri: priceData.imageUrl }} 
            style={styles.cardImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>🎴</Text>
          </View>
        )}
        <Text style={styles.cardName}>{cardName}</Text>
        <Text style={styles.cardDetails}>N° {cardNumber}</Text>
        <Text style={styles.cardDetails}>{cardSet}</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Prix TCGplayer</Text>
        {hasPrices ? (
          <>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Prix moyen :</Text>
              <Text style={styles.statValue}>{priceData.average_price.toFixed(2)} €</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Prix mini :</Text>
              <Text style={styles.statValue}>{priceData.min_price.toFixed(2)} €</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Prix max :</Text>
              <Text style={styles.statValue}>{priceData.max_price.toFixed(2)} €</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>Prix non disponibles pour cette carte</Text>
        )}
      </View>

      {hasPrices && (
        <View style={styles.adviceCard}>
          <Text style={styles.adviceTitle}>💡 Conseil de vente</Text>
          <Text style={styles.adviceText}>
            Prix moyen constaté : {priceData.average_price.toFixed(2)} €
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => Linking.openURL(priceData?.response_url)}
      >
        <Text style={styles.linkButtonText}>Voir les ventes réussies sur eBay</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#e33535', textAlign: 'center', marginBottom: 20 },
  cardInfoContainer: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardImage: { width: screenWidth - 100, height: (screenWidth - 100) * 1.4, borderRadius: 10, marginBottom: 15 },
  noImageContainer: { width: screenWidth - 100, height: (screenWidth - 100) * 1.4, borderRadius: 10, marginBottom: 15, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  noImageText: { fontSize: 60, color: '#999' },
  cardName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  cardDetails: { fontSize: 16, color: '#666', marginTop: 5 },
  statsCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20 },
  statsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statLabel: { fontSize: 16, color: '#666' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  noDataText: { fontSize: 14, color: '#999', textAlign: 'center', marginVertical: 20 },
  adviceCard: { backgroundColor: '#FFF3E0', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#FFB74D' },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#F57C00', marginBottom: 10 },
  adviceText: { fontSize: 14, color: '#555', lineHeight: 20 },
  linkButton: { backgroundColor: '#0073bb', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, marginBottom: 10 },
  linkButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  backButton: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  backButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});