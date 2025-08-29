import React, { useState, memo, useCallback, FC } from "react";
import { Copy, Check, FileText } from "lucide-react";

import { copyToClipboard, generateMarkdown } from "../utils/clipboard";

import { useToast } from "./ToastContainer";

interface CopyButtonProps {
  url: string;
  title: string;
  size?: "sm" | "md" | "lg";
  variant?: "url" | "markdown";
  className?: string;
}

const CopyButton: FC<CopyButtonProps> = memo(
  ({ url, title, size = "md", variant = "url", className = "" }) => {
    const [copied, setCopied] = useState(false);
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

    const handleCopy = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();

        const contentToCopy =
          variant === "markdown" ? generateMarkdown(title, url) : url;
        const success = await copyToClipboard(contentToCopy);

        if (success) {
          setCopied(true);
          showToast(
            "success",
            `${variant === "markdown" ? "Markdown" : "Link"} copied to clipboard!`
          );

          setTimeout(() => {
            setCopied(false);
          }, 2000);
        } else {
          showToast("error", "Failed to copy to clipboard");
        }
      },
      [url, title, variant, showToast]
    );

    const Icon = copied ? Check : variant === "markdown" ? FileText : Copy;
    const iconSize = iconSizes[size];

    const baseClasses = `
    inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${
      copied
        ? "bg-green-500 text-white focus:ring-green-500"
        : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500"
    }
    ${sizeClasses[size]}
    ${className}
  `;

    return (
      <button
        onClick={handleCopy}
        className={baseClasses}
        disabled={copied}
        title={
          copied
            ? `${variant === "markdown" ? "Markdown" : "Link"} copied!`
            : `Copy ${variant === "markdown" ? "markdown" : "link"}`
        }
        aria-label={
          copied
            ? `${variant === "markdown" ? "Markdown" : "Link"} copied to clipboard`
            : `Copy ${variant === "markdown" ? "markdown" : "link"} to clipboard`
        }
      >
        <Icon size={iconSize} />
        {size !== "sm" && (
          <span>
            {copied
              ? "Copied!"
              : `Copy ${variant === "markdown" ? "MD" : "Link"}`}
          </span>
        )}
      </button>
    );
  }
);

CopyButton.displayName = "CopyButton";

export default CopyButton;
