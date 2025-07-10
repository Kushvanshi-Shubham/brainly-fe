import React from "react";
import { cn } from "../../utlis/cn";
import {CrossIcon, SearchIcon } from "../../Icons/IconsImport"; 

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  className,
  placeholder = "Search content...",
}) => {
  const handleClear = () => {

    const event = {
      target: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className={cn("relative w-full sm:max-w-md md:max-w-lg", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-10 text-gray-900",
          "placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500",
          "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500",
          "transition-all duration-200 ease-in-out"
        )}
      />
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            onClick={handleClear}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
            aria-label="Clear search"
          >
            <CrossIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
