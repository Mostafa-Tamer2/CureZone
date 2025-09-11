import React from "react";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function Hero({}: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-50 py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-8 lg:mb-0 lg:mr-8 lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 leading-tight">
              Your Health Is Our
              <br />
              Top Priority
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              We offer all medical supplies at affordable prices
              <br />
              with fast delivery to your home
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-full px-8 py-6 text-base">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full px-8 py-6 text-base"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <img
              src="/Images/PromoBanner/banner-image-15-png.png"
              alt="Medicine bottles and healthcare products"
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
