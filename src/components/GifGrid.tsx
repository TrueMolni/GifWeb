import React, { memo, useMemo, FC } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import GifCard from "./GifCard";

import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

import { Gif } from "../types/giphy";

interface GifGridProps {
  gifs: Gif[];
  onGifClick: (gif: Gif) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const GifGrid: FC<GifGridProps> = memo(
  ({ gifs, onGifClick, onLoadMore, hasMore, isLoading, error, onRetry }) => {
    const sentinelRef = useInfiniteScroll({
      hasMore,
      isLoading,
      onLoadMore,
      rootMargin: "200px",
      threshold: 0.1,
    });

    const handleKeyPress = (gif: Gif, event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onGifClick(gif);
      }
    };

    const memoizedGifs = useMemo(() => gifs, [gifs]);

    return (
      <div className="w-full">
        {/* Main Grid */}
        {memoizedGifs.length > 0 && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
            role="grid"
            aria-label="GIF search results"
          >
            {memoizedGifs.map((gif, index) => (
              <div
                key={`${gif.id}-${index}`}
                role="gridcell"
                tabIndex={0}
                onClick={() => onGifClick(gif)}
                onKeyPress={(e) => handleKeyPress(gif, e)}
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                aria-label={`View details for ${gif.title}`}
              >
                <GifCard gif={gif} />
              </div>
            ))}
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && memoizedGifs.length === 0 && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
            aria-label="Loading GIFs"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Loading */}
        {isLoading && memoizedGifs.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span>Loading more GIFs...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* End of Results */}
        {memoizedGifs.length > 0 && !hasMore && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600 font-medium">
              You've reached the end! Found {memoizedGifs.length} amazing GIFs.
            </p>
          </div>
        )}

        <div ref={sentinelRef} className="h-10" aria-hidden="true" />
      </div>
    );
  }
);

GifGrid.displayName = "GifGrid";

export default GifGrid;
