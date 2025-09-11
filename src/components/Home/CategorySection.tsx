import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function CategorySection({}: Props) {
  const categoryCards = [
    {
      title: "Vitamins",
      backgroundImage: "/Images/ContentSection/div-banner-back.svg",
      productImage: "/Images/ContentSection/banner-image-23-png.png", // Pill jar image
      items: [
        "Analgesics",
        "Antimalarial Drugs",
        "Antipyretics",
        "Antibiotics",
      ],
    },
    {
      title: "Baby Accessories",
      backgroundImage: "/Images/ContentSection/div-banner-back.svg",
      productImage: "/Images/ContentSection/banner-image-22-png.png", // Cream jar image
      items: [
        "Meal Replacements",
        "Protein powder",
        "Muscle building",
        "Low Calorie Snacks",
      ],
    },
    {
      title: "Herbs",
      backgroundImage: "/Images/ContentSection/div-banner-back.svg",
      productImage: "/Images/ContentSection/banner-image-21-png.png", // Aloe vera products
      items: ["Gluten Free", "Sun Care", "Sugar Free", "Super foods"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-screen-2xl py-6 md:py-8 px-3 md:px-4 mx-auto">
      {categoryCards.map((card, index) => (
        <Card
          key={index}
          className="h-auto rounded-lg overflow-hidden relative bg-gray-50"
          style={{
            backgroundImage: `url(${card.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <CardContent className="p-0 h-full relative flex flex-col min-h-[240px] sm:min-h-[260px] md:min-h-[280px]">
            {/* Content Container */}
            <div className="p-4 sm:p-5 md:p-6 flex flex-row justify-between h-full relative">
              {/* Left Content */}
              <div className="flex flex-col justify-between h-full max-w-[65%] sm:max-w-[60%]">
                {/* Category Title */}
                <div className="font-bold text-[#184363] text-base sm:text-lg mb-2 sm:mb-3 md:mb-4">
                  {card.title}
                </div>

                {/* Items List */}
                <ul className="mb-auto">
                  {card.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="mb-2 sm:mb-3 flex items-center"
                    >
                      <ChevronRightIcon className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-[#184363] flex-shrink-0" />
                      <span className="font-normal text-[#184363] text-xs sm:text-sm break-words">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Side - Product Image */}
              <div className="flex items-center justify-center ml-2">
                <img
                  src={card.productImage}
                  alt={`${card.title} product`}
                  className="max-h-32 sm:max-h-40 md:max-h-48 object-contain z-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
