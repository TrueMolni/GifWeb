import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Star, Hash } from "lucide-react";
import { getGifById } from "../api/giphy";
import { Gif } from "../types/giphy";
import { useToast } from "../components/ToastContainer";
import { formatBytes, formatDate } from "../utils/format";
import CopyButton from "../components/CopyButton";
import DownloadButton from "../components/DownloadButton";
import FavoriteToggle from "../components/FavoriteToggle";

const GifDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [gif, setGif] = useState<Gif | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadGif = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const gifData = await getGifById(id);
        setGif(gifData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load GIF";
        setError(errorMessage);
        showToast("error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadGif();
  }, [id, showToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GIF...</p>
        </div>
      </div>
    );
  }

  if (error || !gif) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink size={24} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            GIF Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The GIF you're looking for doesn't exist or couldn't be loaded."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* GIF Display */}
            <div className="relative bg-gray-900 flex items-center justify-center min-h-[400px]">
              <img
                src={gif.originalUrl}
                alt={gif.title}
                className="max-w-full max-h-[600px] object-contain"
                loading="lazy"
              />

              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <FavoriteToggle gifId={gif.id} size="lg" />
              </div>
            </div>

            {/* GIF Information */}
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {gif.title}
                </h1>

                {gif.user && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>by</span>
                    <a
                      href={gif.user.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                    >
                      {gif.user.displayName || gif.user.username}
                      {gif.user.isVerified && (
                        <Star
                          size={14}
                          className="text-yellow-500 fill-current"
                        />
                      )}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-6">
                <CopyButton url={gif.originalUrl} title={gif.title} />
                <DownloadButton gif={gif} />

                {gif.source && (
                  <a
                    href={gif.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                  >
                    <ExternalLink size={16} />
                    View Source
                  </a>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Details</h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {formatDate(gif.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-blue-500 rounded text-xs text-white flex items-center justify-center font-bold">
                        {gif.rating.toUpperCase()}
                      </span>
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium capitalize">
                        {gif.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Properties</h3>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Dimensions:</span>
                      <span className="font-medium ml-2">
                        {gif.width} × {gif.height}
                      </span>
                    </div>

                    {gif.size && (
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium ml-2">
                          {formatBytes(gif.size)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {gif.tags && gif.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Hash size={18} />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gif.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          navigate(`/?q=${encodeURIComponent(tag)}`)
                        }
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm font-medium transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifDetailsPage;
