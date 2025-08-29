const FAVORITES_KEY = "gif-web-favorites";

export const getFavorites = (): string[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load favorites:", error);
    return [];
  }
};

export const addToFavorites = (gifId: string): void => {
  try {
    const favorites = getFavorites();
    if (!favorites.includes(gifId)) {
      const updatedFavorites = [...favorites, gifId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error("Failed to add to favorites:", error);
  }
};

export const removeFromFavorites = (gifId: string): void => {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((id) => id !== gifId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Failed to remove from favorites:", error);
  }
};

export const isFavorite = (gifId: string): boolean => {
  return getFavorites().includes(gifId);
};

export const toggleFavorite = (gifId: string): boolean => {
  const isCurrentlyFavorite = isFavorite(gifId);

  if (isCurrentlyFavorite) {
    removeFromFavorites(gifId);
    return false;
  } else {
    addToFavorites(gifId);
    return true;
  }
};
