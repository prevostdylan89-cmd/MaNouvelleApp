// services/ebayApi.js
const RAPIDAPI_KEY = '4209d8654fmshd827d3cc1af4cb5p1163ddjsn8d488a178a29';

const API_URL = 'https://ebay-average-selling-price.p.rapidapi.com/findCompletedItems';

export const fetchEbayPriceData = async (cardName, cardNumber) => {
  const query = `${cardName} Pokémon ${cardNumber}`;
  console.log(`Recherche eBay pour : ${query}`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'ebay-average-selling-price.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        keywords: query,
        max_search_results: 60,
        remove_outliers: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API eBay (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log('Données eBay reçues:', data);
    return data;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API eBay:", error);
    throw error;
  }
};