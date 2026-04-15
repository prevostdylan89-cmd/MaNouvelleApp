import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@search_history';

export const saveSearch = async (card) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    let history = existing ? JSON.parse(existing) : [];
    const filtered = history.filter(item => !(item.name === card.name && item.number === card.number));
    const newEntry = {
      id: Date.now().toString(),
      name: card.name,
      number: card.number,
      set: card.set,
      timestamp: new Date().toISOString(),
    };
    history = [newEntry, ...filtered];
    if (history.length > 50) history = history.slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde historique:', error);
    return false;
  }
};

export const getHistory = async () => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Erreur effacement historique:', error);
    return false;
  }
};