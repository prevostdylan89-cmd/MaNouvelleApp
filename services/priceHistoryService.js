// services/priceHistoryService.js
// Pour l'exemple, on simule des données. À remplacer par un vrai appel API.
export const fetchHistoricalPrices = async (cardName, cardNumber) => {
  // Simulation d'un appel réseau
  return new Promise((resolve) => {
    setTimeout(() => {
      // Générer des données factices sur 12 mois
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const basePrice = 50 + Math.random() * 100;
      const prices = months.map((month, index) => ({
        value: basePrice + (index - 6) * 3 + Math.random() * 10,
        label: month,
      }));
      resolve(prices);
    }, 1000);
  });
};