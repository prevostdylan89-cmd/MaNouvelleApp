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
  Dimensions,
} from 'react-native';
import { fetchEbayPriceData } from '../services/ebayApi';
import { fetchHistoricalPrices } from '../services/priceHistoryService';
import { LineChart } from 'react-native-gifted-charts';

const { width: screenWidth } = Dimensions.get('window');

export default function PriceDashboardScreen({ route, navigation }) {
  const { cardName, cardNumber, cardSet } = route.params;
  const [loading, setLoading] = useState(true);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(true);

  useEffect(() => {
    const loadPriceData = async () => {
      try {
        setLoading(true);
        const data = await fetchEbayPriceData(cardName, cardNumber);
        setPriceData(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Une erreur est survenue.');
        Alert.alert('Erreur', `Impossible de récupérer les prix eBay : ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const loadHistoricalPrices = async () => {
      try {
        setPriceHistoryLoading(true);
        const data = await fetchHistoricalPrices(cardName, cardNumber);
        setHistoricalPrices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setPriceHistoryLoading(false);
      }
    };

    loadPriceData();
    loadHistoricalPrices();
  }, [cardName, cardNumber]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e33535" />
        <Text style={styles.loadingText}>Analyse des prix eBay en cours...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Retour à la recherche</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Analyse des prix</Text>
      <View style={styles.cardInfoContainer}>
        <Text style={styles.cardName}>{cardName}</Text>
        <Text style={styles.cardDetails}>N° {cardNumber}</Text>
        <Text style={styles.cardDetails}>{cardSet}</Text>
      </View>

      {/* Graphique d'évolution avec défilement horizontal */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>📈 Évolution des prix (12 derniers mois)</Text>
        {priceHistoryLoading ? (
          <ActivityIndicator size="small" color="#4CAF50" />
        ) : historicalPrices.length === 0 ? (
          <Text style={styles.noDataText}>Aucune donnée historique disponible</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View style={{ width: Math.max(screenWidth - 40, historicalPrices.length * 35) }}>
              <LineChart
                data={historicalPrices}
                width={Math.max(screenWidth - 60, historicalPrices.length * 35)}
                height={220}
                areaChart
                color="#4CAF50"
                startFillColor="#4CAF50"
                startOpacity={0.2}
                hideDataPoints={false}
                dataPointsColor="#4CAF50"
                textColor="#333"
                focusEnabled
                showStripOnFocus
                showTextOnFocus
                spacing={30}
                yAxisLabelPrefix="€"
                yAxisTextStyle={{ fontSize: 10 }}
                xAxisLabelTextStyle={{ fontSize: 10 }}
                yAxisLabelWidth={30}
              />
            </View>
          </ScrollView>
        )}
      </View>

      {/* Synthèse eBay */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Synthèse des ventes eBay</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Prix moyen :</Text>
          <Text style={styles.statValue}>{priceData?.average_price?.toFixed(2)} €</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Prix médian :</Text>
          <Text style={styles.statValue}>{priceData?.median_price?.toFixed(2)} €</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Prix minimum :</Text>
          <Text style={styles.statValue}>{priceData?.min_price?.toFixed(2)} €</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Prix maximum :</Text>
          <Text style={styles.statValue}>{priceData?.max_price?.toFixed(2)} €</Text>
        </View>
        <Text style={styles.resultsCount}>Basé sur {priceData?.results} ventes récentes</Text>
      </View>

      {/* Conseil de vente */}
      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>💡 Conseil de vente</Text>
        <Text style={styles.adviceText}>
          Pour une vente rapide, positionne-toi autour du prix médian ({priceData?.median_price?.toFixed(2)} €). 
          Tu peux espérer jusqu'à {priceData?.max_price?.toFixed(2)} € si ta carte est en parfait état et bien présentée.
        </Text>
      </View>

      {/* Lien vers eBay */}
      <TouchableOpacity
        style={styles.ebayLinkButton}
        onPress={() => Linking.openURL(priceData?.response_url)}
      >
        <Text style={styles.ebayLinkText}>Voir les annonces sur eBay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#e33535', padding: 15, borderRadius: 30, alignItems: 'center' },
  retryButtonText: { color: 'white', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#e33535', textAlign: 'center', marginBottom: 20 },
  cardInfoContainer: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  cardDetails: { fontSize: 16, color: '#666', marginTop: 5 },
  chartCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  noDataText: { fontSize: 14, color: '#999', textAlign: 'center', marginVertical: 20 },
  statsCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20 },
  statsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statLabel: { fontSize: 16, color: '#666' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
  resultsCount: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 15 },
  adviceCard: { backgroundColor: '#FFF3E0', borderRadius: 15, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#FFB74D' },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', color: '#F57C00', marginBottom: 10 },
  adviceText: { fontSize: 14, color: '#555', lineHeight: 20 },
  ebayLinkButton: { backgroundColor: '#0073bb', padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 10, marginBottom: 20 },
  ebayLinkText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});