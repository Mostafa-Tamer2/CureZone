"use client";
import CategorySection from "@/components/Home/CategorySection";
import FeatureSection from "@/components/Home/FeatureSection";
// import Hero from "@/components/Home/Hero";
import PromoBanner from "@/components/Home/PromoBanner";
import SpecialOffer from "@/components/Home/SpecialOffer";
import WhyUsSection from "@/components/Home/WhyUsSection";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import SlideShow from "@/components/SlideShow/SlideShow";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function Home({}: Props) {
  return (
    <>
      <SlideShow />
      <CategorySection />
      {/* <Hero /> */}

      {/* Products Section */}
      <div className="py-10">
        <ProductGrid />
      </div>
      {/* Special Offer */}
      <SpecialOffer />
      <PromoBanner />
      <WhyUsSection />
      <FeatureSection />
    </>
  );
}
