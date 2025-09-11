import React from "react";
import { MapPin, Phone } from "lucide-react";
// import { cn } from "@/lib/utils";
import LanguageMenu from "./LanguageMenu";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function TopBar({}: Props) {
  return (
    <div className="w-full bg-white py-2 border-b">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 px-4 md:px-6">
        {/* Language + Account */}
        <div className="flex items-center space-x-4 relative">
          <div className="relative z-50">
            {" "}
            {/* Added z-50 for LanguageMenu */}
            <LanguageMenu />
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>My account</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 justify-center flex-grow">
          <MapPin className="h-4 w-4 text-blue-400 mr-1" />
          <span>Manjial / AbdulelAziz Al Soud 32</span>
        </div>

        {/* Phone */}
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 text-blue-400 mr-1" />
          <span>Sales & Service Support / 1900</span>
        </div>
      </div>
    </div>
  );
}
