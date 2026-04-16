// services/pokeApiService.js
// Récupère les informations d'un Pokémon depuis PokeAPI (gratuit, sans clé)

export const fetchPokemonInfo = async (frenchName) => {
  try {
    // D'abord, on a besoin du nom anglais. Pour ça, on va utiliser une correspondance basique
    // car PokeAPI ne gère que les noms anglais.
    // Si tu as déjà un mapping français->anglais, tu peux l'utiliser ici.
    // Sinon, on va essayer une recherche directe (mais ça ne fonctionnera qu'avec les noms anglais)
    
    const englishName = frenchName.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${englishName}`);
    
    if (!response.ok) {
      throw new Error(`Pokémon "${frenchName}" non trouvé`);
    }
    
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name),
      imageUrl: data.sprites.other['official-artwork'].front_default,
    };
  } catch (error) {
    console.error("Erreur PokeAPI:", error);
    return null;
  }
};

// Alternative : recherche par numéro
export const fetchPokemonById = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error(`Pokémon #${id} non trouvé`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(t => t.type.name),
      imageUrl: data.sprites.other['official-artwork'].front_default,
    };
  } catch (error) {
    console.error("Erreur PokeAPI:", error);
    return null;
  }
};

// Récupère la liste des cartes Pokémon TCG (via l'API Pokémon TCG, qui est différente)
// Pour les cartes, on garde l'API Pokémon TCG (pokemontcg.io)
export const searchPokemonCard = async (cardName, cardNumber) => {
  try {
    const query = `name:${cardName} number:${cardNumber}`;
    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Erreur recherche carte:", error);
    return [];
  }
};