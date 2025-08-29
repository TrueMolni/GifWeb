import { useState, useEffect, useCallback, useMemo, useRef, FC } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { Sparkles, Search as SearchIcon } from "lucide-react";

import GifGrid from "../components/GifGrid";
import { useToast } from "../components/ToastContainer";

import { searchGifs } from "../api/giphy";

import { useDebouncedValue } from "../hooks/useDebouncedValue";

import { Gif, SearchResult } from "../types/giphy";

const PAGE_LIMIT = 25;

const HomePage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  const skipNextDebouncedRef = useRef(false);

  const memoizedGifs = useMemo(() => gifs, [gifs]);
  const showWelcomeState = useMemo(
    () => !searchQuery.trim() && gifs.length === 0,
    [searchQuery, gifs.length]
  );
  const showNoResults = useMemo(
    () => searchQuery.trim() && gifs.length === 0 && !isLoading,
    [searchQuery, gifs.length, isLoading]
  );

  const performSearch = useCallback(
    async (query: string, searchOffset = 0, isNewSearch = false) => {
      if (!apiKey) return;

      // якщо порожній рядок — чистимо стани і виходимо
      if (!query.trim()) {
        if (isNewSearch) {
          setGifs([]);
          setHasMore(true);
          setOffset(0);
          setError(null);
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result: SearchResult = await searchGifs({
          query: query.trim(),
          limit: PAGE_LIMIT,
          offset: searchOffset,
          rating: "g",
          lang: "en",
        });

        setGifs((prev) =>
          isNewSearch ? result.gifs : [...prev, ...result.gifs]
        );
        setHasMore(result.hasMore);
        setOffset(result.nextOffset);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search GIFs";
        setError(errorMessage);
        showToast("error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [apiKey, showToast]
  );

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    // якщо ми щойно зробили ручний пошук — пропускаємо цей дебаунс-цикл
    if (skipNextDebouncedRef.current) {
      skipNextDebouncedRef.current = false;
      return;
    }

    // синхронізуємо URL
    if (debouncedQuery !== (searchParams.get("q") || "")) {
      if (debouncedQuery.trim()) {
        setSearchParams({ q: debouncedQuery });
      } else {
        setSearchParams({});
      }
    }

    // новий пошук з нуля
    performSearch(debouncedQuery, 0, true);
  }, [debouncedQuery, performSearch, searchParams, setSearchParams]);

  // Сабміт із поля пошуку або клік по підказці
  const handleSearchSubmit = useCallback(
    (query: string) => {
      const next = (query ?? "").trim();
      setSearchQuery(next);
      setSearchParams(next ? { q: next } : {});
      // позначаємо, що ми вже самі зробили пошук — дебаунс хай пропустить цей цикл
      skipNextDebouncedRef.current = true;
      performSearch(next, 0, true);
    },
    [performSearch, setSearchParams]
  );

  // Довантажити ще
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && searchQuery.trim()) {
      performSearch(searchQuery, offset, false);
    }
  }, [isLoading, hasMore, searchQuery, offset, performSearch]);

  // Перехід у деталі
  const navigateToGif = useCallback(
    (gif: Gif) => {
      navigate(`/gif/${gif.id}`);
    },
    [navigate]
  );

  // Try Again: повністю очистити і перезапустити
  const handleRetry = useCallback(() => {
    setSearchQuery("");
    setSearchParams({});
    skipNextDebouncedRef.current = true;
    performSearch("", 0, true);
  }, [performSearch, setSearchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-blue-500" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">GIF Web</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover and share amazing GIFs from Giphy. Search, favorite, and
            download your perfect moments.
          </p>
        </div>

        {/* API Key Warning */}
        {!apiKey && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <SearchIcon size={20} />
                <span className="font-medium">API Key Required</span>
              </div>
              <p className="text-amber-700 mt-1 text-sm">
                Add your Giphy API key to{" "}
                <code className="bg-amber-100 px-2 py-1 rounded">
                  VITE_GIPHY_API_KEY
                </code>{" "}
                in your environment variables to enable search.
              </p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            disabled={!apiKey}
            placeholder="Search for GIFs... (e.g., cats, react, coding)"
          />
        </div>

        {/* Content */}
        {showWelcomeState ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Ready to Find GIFs?
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Enter a search term above to discover thousands of animated
                GIFs. Try searching for your favorite topics!
              </p>
            </div>

            {apiKey && (
              <div className="flex flex-wrap gap-2 justify-center">
                {["cats", "react", "coding", "celebration", "funny"].map(
                  (suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => handleSearchSubmit(suggestion)}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors text-sm font-medium"
                    >
                      {suggestion}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ) : showNoResults ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No GIFs Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any GIFs for &quot;{searchQuery}&quot;. Try
              a different search term.
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        ) : (
          <GifGrid
            gifs={memoizedGifs}
            onGifClick={navigateToGif}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
