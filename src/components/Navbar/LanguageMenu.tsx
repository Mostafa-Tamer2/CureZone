"use client";
import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function LanguageMenu({}: Props) {
  // Toggle dropdown open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Store the currently selected language code
  const [selectedLanguage, setSelectedLanguage] = useState<"EN" | "AR">("EN");

  // Language options
  const languages = [
    { code: "EN", name: "English" },
    { code: "AR", name: "العربية" },
  ] as const;

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle language selection
  const selectLanguage = (code: (typeof languages)[number]["code"]) => {
    setSelectedLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block z-50">
      {/* Language Selector Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition duration-200"
      >
        <span>{selectedLanguage}</span>

        {/* Dropdown Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            {languages.map((language) => (
              <li
                key={language.code}
                onClick={() => selectLanguage(language.code)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                  selectedLanguage === language.code
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {language.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
