"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

type Props = Record<string, never>;

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  productImage: string;
  backgroundImage: string;
  accentColor: string;
}

export default function SlideShow({}: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const slideRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const slides = useMemo<SlideData[]>(
    () => [
      {
        id: 1,
        title: "Vitamin B6",
        subtitle: "Essential Nutrients",
        description:
          "Support your immune system and boost energy levels naturally.",
        buttonText: "Shop Now",
        productImage: "/Images/slide1.png",
        backgroundImage: "/Images/bg1.jpg",
        accentColor: "from-blue-600 to-purple-600",
      },
      {
        id: 2,
        title: "Minerals Plus",
        subtitle: "Daily Wellness",
        description:
          "Complete mineral complex for optimal cellular function and bone health.",
        buttonText: "Shop Now",
        productImage: "/Images/slide2.png",
        backgroundImage: "/Images/bg2.jpeg",
        accentColor: "from-emerald-500 to-teal-700",
      },
      {
        id: 3,
        title: "Multi Essentials",
        subtitle: "Premium Formula",
        description:
          "All-in-one daily multivitamin with 24 essential nutrients and antioxidants.",
        buttonText: "Shop Now",
        productImage: "/Images/slide3.png",
        backgroundImage: "/Images/bg3.jpg",
        accentColor: "from-amber-500 to-orange-700",
      },
    ],
    []
  );

  // Function to start auto-cycling
  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isAnimating) {
        handleSlideChange(
          "right",
          currentSlide === slides.length - 1 ? 0 : currentSlide + 1
        );
      }
    }, 6000);
  };

  // Function to stop auto-cycling
  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Clear animation timeout to prevent memory leaks
  const clearAnimationTimeout = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  const handleSlideChange = (
    newDirection: "left" | "right",
    targetSlide: number
  ) => {
    if (isAnimating) return;

    // Reset auto-cycle timer when manually navigating
    stopAutoSlide();
    clearAnimationTimeout();

    // Batch state updates to reduce renders
    setIsAnimating(true);
    setDirection(newDirection);
    setCurrentSlide(targetSlide);

    // Allow animation to complete before accepting new navigation
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      startAutoSlide(); // Restart auto-cycling after manual navigation
    }, 400);
  };

  // Function to move to the next slide
  const nextSlide = () => {
    const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    handleSlideChange("left", nextIndex);
  };

  // Function to move to the previous slide
  const prevSlide = () => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    handleSlideChange("right", prevIndex);
  };

  // Function to navigate to a specific slide using dots
  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;

    // Determine direction based on current and target slide
    const newDirection = index > currentSlide ? "left" : "right";
    handleSlideChange(newDirection, index);
  };

  // Initialize auto-cycle on component mount
  useEffect(() => {
    startAutoSlide();

    // Setup pause/resume on hover
    const slideElement = slideRef.current;

    const handleMouseEnter = () => {
      stopAutoSlide();
    };

    const handleMouseLeave = () => {
      startAutoSlide();
    };

    if (slideElement) {
      slideElement.addEventListener("mouseenter", handleMouseEnter);
      slideElement.addEventListener("mouseleave", handleMouseLeave);
    }

    // Cleanup on unmount
    return () => {
      stopAutoSlide();
      clearAnimationTimeout();
      if (slideElement) {
        slideElement.removeEventListener("mouseenter", handleMouseEnter);
        slideElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Update autoSlide when currentSlide changes
  useEffect(() => {
    // Reset the auto slide timer when the slide changes
    stopAutoSlide();
    startAutoSlide();

    return () => {
      stopAutoSlide();
    };
  }, [currentSlide]);

  const getVisibleSlides = () => {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;

    return slides.filter(
      (_, index) =>
        index === currentSlide || index === prevIndex || index === nextIndex
    );
  };

  const visibleSlides = getVisibleSlides();

  return (
    <div
      ref={slideRef}
      className="relative w-full h-screen max-h-[700px] overflow-hidden my-8 rounded-xl shadow-2xl"
    >
      {/* Slides container */}
      <div className="h-full relative">
        {visibleSlides.map((slide) => {
          const index = slides.findIndex((s) => s.id === slide.id);
          const isCurrent = index === currentSlide;
          const isNext =
            (currentSlide === slides.length - 1 ? 0 : currentSlide + 1) ===
            index;
          const isPrev =
            (currentSlide === 0 ? slides.length - 1 : currentSlide - 1) ===
            index;

          let slidePosition = "";

          if (isCurrent) {
            slidePosition = "z-20 opacity-100 translate-x-0";
          } else if (direction === "left") {
            if (isNext) {
              slidePosition = "z-10 opacity-0 translate-x-full"; // Entering from right
            } else {
              slidePosition = "z-10 opacity-0 -translate-x-full"; // Exiting to left
            }
          } else if (direction === "right") {
            if (isPrev) {
              slidePosition = "z-10 opacity-0 -translate-x-full"; // Entering from left
            } else {
              slidePosition = "z-10 opacity-0 translate-x-full"; // Exiting to right
            }
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 will-change-transform ${slidePosition}`}
              style={{
                transform: `translateX(${
                  isCurrent
                    ? 0
                    : direction === "left" && isNext
                    ? "100%"
                    : direction === "right" && isPrev
                    ? "-100%"
                    : 0
                })`,
              }}
            >
              {/* Background with gradient overlay*/}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.backgroundImage})` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} opacity-60`}
                ></div>
              </div>

              {/* Content container with glass effect */}
              <div className="relative h-full flex items-center px-12 lg:px-24">
                <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                  {/* Text content */}
                  <div
                    className={`md:w-1/2 text-white p-8 md:p-0 text-center md:text-left
                    transform transition-all duration-700 will-change-transform
                    ${
                      isCurrent
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                    style={{ transitionDelay: isCurrent ? "300ms" : "0ms" }}
                  >
                    <p className="uppercase tracking-widest text-lg mb-2 font-light">
                      {slide.subtitle}
                    </p>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-lg">
                      {slide.description}
                    </p>
                    <Link href="/shop">
                      <button
                        className={`bg-white text-gray-900 px-8 py-4 rounded-full 
                      font-semibold flex items-center gap-2 hover:scale-105 transition-all 
                      shadow-lg hover:shadow-xl group`}
                      >
                        {slide.buttonText}
                        <ShoppingBag className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>

                  {/* Product images */}
                  <div
                    className={`md:w-1/2 flex justify-center mt-8 md:mt-0
                    transform transition-all duration-700 will-change-transform
                    ${
                      isCurrent
                        ? "translate-x-0 opacity-100"
                        : "translate-x-16 opacity-0"
                    }`}
                    style={{ transitionDelay: isCurrent ? "500ms" : "0ms" }}
                  >
                    {slide.productImage && (
                      <div className="relative h-64 md:h-80 lg:h-96 w-64 md:w-80 lg:w-96">
                        <img
                          src={slide.productImage}
                          alt={slide.title}
                          className="absolute h-full w-full object-contain drop-shadow-2xl
                            transform rotate-3 hover:rotate-6 transition-transform duration-300"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 
          bg-white/20 backdrop-blur-md text-white p-3 rounded-full 
          hover:bg-white/30 transition-all duration-300 hover:scale-110
          focus:outline-none border border-white/30 shadow-lg"
        aria-label="Previous slide"
        disabled={isAnimating}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 
          bg-white/20 backdrop-blur-md text-white p-3 rounded-full 
          hover:bg-white/30 transition-all duration-300 hover:scale-110
          focus:outline-none border border-white/30 shadow-lg"
        aria-label="Next slide"
        disabled={isAnimating}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Progress indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-500 ${
              index === currentSlide
                ? "w-12 h-3 bg-white rounded-full"
                : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isAnimating}
          />
        ))}
      </div>
    </div>
  );
}
