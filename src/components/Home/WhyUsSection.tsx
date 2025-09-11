import React from "react";
import { Card, CardContent } from "../ui/card";

export default function WhyUsSection() {
  const features = [
    {
      icon: "/Images/WhyUsSection/supplement.svg",
      title: "Wide Product Range",
      description:
        "Libero diam auctor tristique hendrerit in eu vel id. Nec leo amet suscipit nulla.",
    },
    {
      icon: "/Images/WhyUsSection/shield.svg",
      title: "Quality Assurance",
      description:
        "Libero diam auctor tristique hendrerit in eu vel id. Nec leo amet suscipit nulla.",
    },
    {
      icon: "/Images/WhyUsSection/herbal-drug.svg",
      title: "Eco-Friendly Practices",
      description:
        "Libero diam auctor tristique hendrerit in eu vel id. Nec leo amet suscipit nulla.",
    },
  ];

  return (
    <section className="relative w-full py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10">
          {/* Left side content */}
          <div className="flex flex-col w-full lg:w-1/2">
            <span className="text-red-600 font-sub-heading font-[number:var(--sub-heading-font-weight)] text-[length:var(--sub-heading-font-size)] tracking-[var(--sub-heading-letter-spacing)] leading-[var(--sub-heading-line-height)] [font-style:var(--sub-heading-font-style)]">
              Why Try ChatBot
            </span>

            <h2 className="mt-3 md:mt-5 mb-6 md:mb-10 font-heading-3 font-[number:var(--heading-3-font-weight)] text-app-primary text-[length:var(--heading-3-font-size)] tracking-[var(--heading-3-letter-spacing)] leading-[var(--heading-3-line-height)] [font-style:var(--heading-3-font-style)]">
              Our ChatBot
            </h2>

            <div className="flex flex-col gap-8 md:gap-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 md:gap-6">
                  <Card className="w-16 h-16 md:w-20 md:h-20 bg-[#1364ff] rounded-xl md:rounded-[15px] overflow-hidden flex items-center justify-center shrink-0">
                    <CardContent className="p-0 flex items-center justify-center w-full h-full">
                      <img
                        className="w-6 h-6 md:w-8 md:h-8"
                        alt={feature.title}
                        src={feature.icon}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex flex-col items-start gap-2 md:gap-3">
                    <h3 className="font-heading-7 font-[number:var(--heading-5-font-weight)] text-app-primary text-[length:var(--heading-5-font-size)] tracking-[var(--heading-5-letter-spacing)] leading-[var(--heading-5-line-height)] [font-style:var(--heading-5-font-style)]">
                      {feature.title}
                    </h3>
                    <p className="max-w-md font-body-2 font-[number:var(--body-2-font-weight)] text-text text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] [font-style:var(--body-2-font-style)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side image */}
          <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] lg:h-[624px] rounded-xl md:rounded-[15px] overflow-hidden relative mt-8 lg:mt-0">
            <div className="absolute inset-0 w-full h-full bg-[#1364ff] flex items-center justify-center">
              {/* Decorative dots */}
              <div className="absolute w-8 h-8 md:w-12 md:h-12 top-[15%] right-[10%]">
                <div className="absolute w-4 h-4 md:w-5 md:h-5 top-0 right-0 bg-white rounded-full opacity-100" />
                <div className="absolute w-4 h-4 md:w-5 md:h-5 top-0 left-0 bg-white rounded-full opacity-80" />
                <div className="absolute w-4 h-4 md:w-5 md:h-5 bottom-0 right-0 bg-white rounded-full opacity-60" />
              </div>

              {/* Bot image with float animation */}
              <div className="relative h-[90%] w-auto flex items-end justify-center">
                <img
                  className="max-h-full w-auto object-contain animate-float"
                  alt="ChatBot"
                  src="/Images/WhyUsSection/bot_image.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for float animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
