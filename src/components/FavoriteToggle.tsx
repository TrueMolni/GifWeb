import React, { useState, useEffect, memo, useCallback, FC } from "react";
import { Heart } from "lucide-react";

import { toggleFavorite, isFavorite } from "../utils/favorites";

import { useToast } from "./ToastContainer";

interface FavoriteToggleProps {
  gifId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const FavoriteToggle: FC<FavoriteToggleProps> = memo(
  ({ gifId, size = "md", className = "" }) => {
    const [favorited, setFavorited] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { showToast } = useToast();

    const sizeClasses = {
      sm: "p-2",
      md: "p-2",
      lg: "p-3",
    };

    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 24,
    };

    useEffect(() => {
      setFavorited(isFavorite(gifId));
    }, [gifId]);

    const handleToggle = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();

        setIsAnimating(true);
        const newFavoriteState = toggleFavorite(gifId);
        setFavorited(newFavoriteState);

        showToast(
          "success",
          newFavoriteState ? "Added to favorites!" : "Removed from favorites"
        );

        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      },
      [gifId, showToast]
    );

    const baseClasses = `
    inline-flex items-center justify-center rounded-full transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      favorited
        ? "bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-500"
        : "bg-white/90 hover:bg-white text-gray-600 hover:text-pink-500 focus:ring-pink-500"
    }
    ${isAnimating ? "scale-125" : "scale-100"}
    ${sizeClasses[size]}
    ${className}
  `;

    return (
      <button
        onClick={handleToggle}
        className={baseClasses}
        title={favorited ? "Remove from favorites" : "Add to favorites"}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={iconSizes[size]}
          className={`transition-all duration-200 ${favorited ? "fill-current" : ""}`}
        />
      </button>
    );
  }
);

FavoriteToggle.displayName = "FavoriteToggle";

export default FavoriteToggle;
