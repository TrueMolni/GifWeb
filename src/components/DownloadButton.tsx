import React, { useState, memo, useCallback, FC } from "react";
import { Download, Check } from "lucide-react";

import { downloadFile, generateFilename } from "../utils/files";

import { useToast } from "./ToastContainer";

import { Gif } from "../types/giphy";

interface DownloadButtonProps {
  gif: Gif;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const DownloadButton: FC<DownloadButtonProps> = memo(
  ({ gif, size = "md", className = "" }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const { showToast } = useToast();

    const sizeClasses = {
      sm: "p-2",
      md: "px-4 py-2",
      lg: "px-6 py-3",
    };

    const iconSizes = {
      sm: 16,
      md: 18,
      lg: 20,
    };

    const handleDownload = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isDownloading) return;

        setIsDownloading(true);

        try {
          const filename = generateFilename(gif.title, gif.id);
          const success = await downloadFile(gif.originalUrl, filename);

          if (success) {
            setDownloaded(true);
            showToast("success", "GIF downloaded successfully!");

            setTimeout(() => {
              setDownloaded(false);
            }, 3000);
          } else {
            showToast("error", "Failed to download GIF. Please try again.");
          }
        } catch (error) {
          console.error("Download error:", error);
          showToast("error", "Download failed. Please check your connection.");
        } finally {
          setIsDownloading(false);
        }
      },
      [gif.originalUrl, gif.title, gif.id, showToast, isDownloading]
    );

    const getIcon = () => {
      if (isDownloading) return null;
      if (downloaded) return Check;
      return Download;
    };

    const getButtonState = () => {
      if (isDownloading) return { bg: "bg-gray-500", text: "Downloading..." };
      if (downloaded) return { bg: "bg-green-500", text: "Downloaded!" };
      return { bg: "bg-indigo-500 hover:bg-indigo-600", text: "Download" };
    };

    const Icon = getIcon();
    const { bg, text } = getButtonState();
    const iconSize = iconSizes[size];

    const baseClasses = `
    inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    text-white disabled:cursor-not-allowed
    ${bg}
    ${sizeClasses[size]}
    ${className}
  `;

    return (
      <button
        onClick={handleDownload}
        disabled={isDownloading || downloaded}
        className={baseClasses}
        title={
          isDownloading
            ? "Downloading..."
            : downloaded
              ? "Downloaded!"
              : "Download GIF"
        }
        aria-label={`${text} ${gif.title}`}
      >
        {isDownloading ? (
          <div
            className="animate-spin rounded-full border-2 border-white border-t-transparent"
            style={{ width: iconSize, height: iconSize }}
          />
        ) : (
          Icon && <Icon size={iconSize} />
        )}
        {size !== "sm" && <span>{text}</span>}
      </button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export default DownloadButton;
