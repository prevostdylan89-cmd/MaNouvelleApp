// services/ebayApi.js
export const fetchEbayPriceData = async (cardName, cardNumber, cardSet) => {
  const cleanNumber = cardNumber.split('/')[0].replace(/^0+/, '');
  const query = `name:${cardName} number:${cleanNumber}`;
  const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur API (${response.status})`);
    
    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      throw new Error('Aucune carte trouvée');
    }
    
    let card = data.data[0];
    if (cardSet) {
      const exactCard = data.data.find(c => c.set.name === cardSet);
      if (exactCard) card = exactCard;
    }
    
    // Récupération des prix
    const tcgplayerPrices = card.tcgplayer?.prices;
    const cardmarketPrices = card.cardmarket?.prices;
    
    let avgPrice = null, lowPrice = null, highPrice = null;
    
    if (tcgplayerPrices) {
      const normal = tcgplayerPrices.normal || tcgplayerPrices.holofoil;
      if (normal) {
        avgPrice = normal.market || normal.mid;
        lowPrice = normal.low;
        highPrice = normal.high;
      }
    }
    
    if (!avgPrice && cardmarketPrices) {
      avgPrice = cardmarketPrices.averageSellPrice;
      lowPrice = cardmarketPrices.lowPrice;
      highPrice = cardmarketPrices.trendPrice;
    }
    
    // Récupération de l'image de la carte
    const imageUrl = card.images?.large || card.images?.small || null;
    
    // Lien eBay avec filtre ventes réussies
    const ebaySearchTerm = `${cardName} ${cleanNumber} ${card.set.name}`;
    const ebayUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(ebaySearchTerm)}&_sacat=2536&LH_Complete=1&_sop=12`;
    
    return {
      average_price: avgPrice || 0,
      median_price: avgPrice || 0,
      min_price: lowPrice || 0,
      max_price: highPrice || 0,
      results: avgPrice ? 1 : 0,
      response_url: ebayUrl,
      cardSet: card.set.name,
      imageUrl: imageUrl,
    };
  } catch (error) {
    console.error('Erreur API prix:', error);
    const fallbackUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${cardName} ${cardNumber}`)}&_sacat=2536&LH_Complete=1&_sop=12`;
    return {
      average_price: 0,
      median_price: 0,
      min_price: 0,
      max_price: 0,
      results: 0,
      response_url: fallbackUrl,
      imageUrl: null,
    };
  }
};