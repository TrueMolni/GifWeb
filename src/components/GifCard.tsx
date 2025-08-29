import { useState, memo, FC } from "react";
import { ExternalLink, User, Calendar } from "lucide-react";

import { formatDate } from "../utils/format";

import CopyButton from "./CopyButton";
import DownloadButton from "./DownloadButton";
import FavoriteToggle from "./FavoriteToggle";

import { Gif } from "../types/giphy";

interface GifCardProps {
  gif: Gif;
}

const GifCard: FC<GifCardProps> = memo(({ gif }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!imageError ? (
          <img
            src={gif.previewUrl}
            alt={gif.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <ExternalLink size={32} />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <FavoriteToggle gifId={gif.id} />
            <CopyButton url={gif.originalUrl} title={gif.title} size="sm" />
            <DownloadButton gif={gif} size="sm" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded uppercase">
            {gif.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {gif.title || "Untitled GIF"}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {gif.user && (
              <div
                className="flex items-center gap-1"
                title={`By ${gif.user.displayName || gif.user.username}`}
              >
                <User size={14} />
                <span className="truncate max-w-20">
                  {gif.user.displayName || gif.user.username}
                </span>
              </div>
            )}

            <div
              className="flex items-center gap-1"
              title={`Created on ${formatDate(gif.createdAt)}`}
            >
              <Calendar size={14} />
              <span>{new Date(gif.createdAt).getFullYear()}</span>
            </div>
          </div>

          <div className="text-xs font-medium text-gray-400">
            {gif.width}×{gif.height}
          </div>
        </div>
      </div>
    </div>
  );
});

GifCard.displayName = "GifCard";

export default GifCard;
