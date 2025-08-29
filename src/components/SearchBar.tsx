import React, { useState, useCallback, memo, FC } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void; 
  placeholder?: string;
  disabled?: boolean;
}

const SearchBar: FC<SearchBarProps> = memo(
  ({
    value,
    onChange,
    onSubmit,
    placeholder = "Search for GIFs...",
    disabled = false,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        
        onSubmit(value.trim());
      },
      [value, onSubmit]
    );

    const handleClear = useCallback(() => {
      onChange("");
    }, [onChange]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClear();
        }
      },
      [handleClear]
    );

    return (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto"
        role="search"
        aria-label="GIF search"
      >
        <div className="relative">
          <div
            className={`
            relative flex items-center bg-white rounded-full shadow-lg border-2 transition-all duration-200
            ${isFocused ? "border-blue-500 shadow-xl" : "border-gray-200 hover:border-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            <Search
              size={20}
              className={`
              absolute left-4 transition-colors duration-200
              ${isFocused ? "text-blue-500" : "text-gray-400"}
            `}
              aria-hidden="true"
            />

            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="
              w-full py-4 pl-12 pr-12 text-lg bg-transparent outline-none rounded-full
              placeholder-gray-400 text-gray-900 disabled:cursor-not-allowed
            "
              aria-label="Search for GIFs"
              autoComplete="off"
              spellCheck="false"
            />

            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="
                absolute right-4 p-1 rounded-full hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              "
                aria-label="Clear search"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </form>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
