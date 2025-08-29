import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";

import GifGrid from "../components/GifGrid";

import { getGifsByIds } from "../api/giphy";
import { Gif } from "../types/giphy";
import { getFavorites, removeFromFavorites } from "../utils/favorites";
import { useToast } from "../components/ToastContainer";

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [favoriteGifs, setFavoriteGifs] = useState<Gif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const abortRef = useRef<AbortController | null>(null);

  const loadFavorites = useCallback(async () => {
    // Скасувати попередній запит, якщо ще триває
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const favoriteIds = getFavorites(); 
      if (favoriteIds.length === 0) {
        setFavoriteGifs([]);
        return;
      }

      
      const gifs = await getGifsByIds(favoriteIds, controller.signal);
      setFavoriteGifs(gifs);

      
      const validIds = new Set(gifs.map((g) => g.id));
      favoriteIds
        .filter((id) => !validIds.has(id))
        .forEach((id) => removeFromFavorites(id));
    } catch (err) {
      
      if (err instanceof Error && err.message === "Request was cancelled")
        return;

      const errorMessage =
        err instanceof Error ? err.message : "Failed to load favorites";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Первинне завантаження
  useEffect(() => {
    loadFavorites();
    return () => {
      // Скасувати запит при розмонтуванні
      if (abortRef.current) abortRef.current.abort();
    };
  }, [loadFavorites]);

  // Синхронізація між вкладками/сторінками (коли змінюється localStorage.favorites)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "favorites") {
        loadFavorites();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadFavorites]);

  const handleGifClick = useCallback(
    (gif: Gif) => {
      navigate(`/gif/${gif.id}`);
    },
    [navigate]
  );

  const handleClearAll = useCallback(() => {

    const ok = window.confirm(
      "Are you sure you want to remove all favorites? This action cannot be undone."
    );
    if (!ok) return;

    const favoriteIds = getFavorites();
    favoriteIds.forEach((id) => removeFromFavorites(id));
    setFavoriteGifs([]);
    showToast("success", "All favorites cleared");
  }, [showToast]);

  const handleRetry = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="container mx-auto px-4 py-8" aria-live="polite">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Back to Search"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              <span>Back to Search</span>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart
                  className="text-pink-500 fill-current"
                  size={32}
                  aria-hidden="true"
                />
                <h1 className="text-3xl font-bold text-gray-900">
                  Your Favorites
                </h1>
              </div>
              <p className="text-gray-600">
                {favoriteGifs.length > 0
                  ? `${favoriteGifs.length} saved GIF${favoriteGifs.length === 1 ? "" : "s"}`
                  : "No favorites saved yet"}
              </p>
            </div>

            {favoriteGifs.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                aria-label="Clear all favorites"
              >
                <Trash2 size={16} aria-hidden="true" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-red-500" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Favorites
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : favoriteGifs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={40} className="text-pink-500" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start exploring and click the heart icon on any GIF to add it to
              your favorites collection.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-medium"
            >
              Discover GIFs
            </Link>
          </div>
        ) : (
          <GifGrid
            gifs={favoriteGifs}
            onGifClick={handleGifClick}
            onLoadMore={() => {}}
            hasMore={false}
            isLoading={false}
            error={null}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
