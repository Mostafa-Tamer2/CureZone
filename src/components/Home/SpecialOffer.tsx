import { ArrowRightIcon, BadgePercent, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function SpecialOffer({}: Props) {
  const [hovered1, setHovered1] = useState(false);
  const [hovered2, setHovered2] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full py-16 px-4">
      {/* Special Offer Heading with decorative elements */}
      <div className="relative flex items-center justify-center mb-8 w-full">
        {/* Left Gradient Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-r from-transparent to-blue-500 rounded-full hidden md:block" />

        {/* Centered Heading */}
        <div className="relative z-10 flex items-center space-x-2">
          <BadgePercent className="h-6 w-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-[#184363]">Special Offers</h2>
        </div>

        {/* Right Gradient Line */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-1 bg-gradient-to-l from-transparent to-blue-500 rounded-full hidden md:block" />
      </div>

      <p className="text-gray-600 max-w-md text-center mb-10">
        Limited time deals on our premium health products. Don't miss out!
      </p>

      {/* Cards Container (Improved responsive layout) */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center w-full max-w-6xl gap-8">
        {/* Special Offer Card 1 - COVID Pack */}
        <motion.div
          className="w-full lg:w-1/2"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="h-full rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-blue-300 transition-all duration-300"
            onMouseEnter={() => setHovered1(true)}
            onMouseLeave={() => setHovered1(false)}
          >
            <CardContent className="p-0 h-full relative bg-gradient-to-br from-blue-50 to-sky-100">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-[url(/Images/SpecialOffer/div-banner-back-1.svg)] bg-cover bg-right opacity-70" />

              {/* Badge */}
              <div className="absolute top-8 right-8">
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                  45% OFF
                </Badge>
              </div>

              {/* Content */}
              <div className="relative z-10 p-10 flex flex-col h-full">
                <span className="font-medium text-blue-700 text-sm mb-2">
                  From EGP 200
                </span>

                <h3 className="font-bold text-[#184363] text-3xl mb-2">
                  COVID-19 Pack
                </h3>
                <p className="text-blue-800 text-lg mb-6">
                  Complete protection essentials
                </p>

                <ul className="space-y-2 mb-8 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                    5 Face Masks
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                    Hand Sanitizer
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                    Safety Guide
                  </li>
                </ul>

                <div className="mt-auto"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Special Offer Card 2 - Face Mask */}
        <motion.div
          className="w-full lg:w-1/2"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className="h-full rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-amber-300 transition-all duration-300"
            onMouseEnter={() => setHovered2(true)}
            onMouseLeave={() => setHovered2(false)}
          >
            <CardContent className="p-0 h-full relative bg-gradient-to-br from-amber-50 to-amber-100">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-[url(/Images/SpecialOffer/div-banner-back-2.svg)] bg-cover bg-right opacity-70" />

              {/* Badge */}
              <div className="absolute top-8 right-8">
                <Badge className="bg-[#f2971f] hover:bg-amber-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                  BEST SELLER
                </Badge>
              </div>

              {/* Content */}
              <div className="relative z-10 p-10 flex flex-col h-full">
                <span className="font-medium text-amber-700 text-sm mb-2">
                  From EGP 150
                </span>

                <h3 className="font-bold text-[#184363] text-3xl mb-2">
                  Breathable Face Mask
                </h3>
                <p className="text-amber-800 text-lg mb-6">
                  Premium comfort & protection
                </p>

                <ul className="space-y-2 mb-8 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2"></div>
                    5-Layer Filtration
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2"></div>
                    Adjustable Ear Loops
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2"></div>
                    Washable & Reusable
                  </li>
                </ul>

                <div className="mt-auto"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
