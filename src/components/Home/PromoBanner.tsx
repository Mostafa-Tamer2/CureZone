import { ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function PromoBanner({}: Props) {
  return (
    <Card className="w-11/12 h-[296px] rounded-[10px] [background:url(/Images/PromoBanner/main.png)_50%_50%_/_cover,linear-gradient(0deg,rgba(168,224,245,1)_0%,rgba(168,224,245,1)_100%)] mx-auto my-4">
      <CardContent className="p-0 h-full relative">
        <div className="flex h-full">
          {/* Left section with image (banner-image-15) */}
          <div className="w-1/3 flex justify-center">
            <div className="relative w-[150px] sm:w-[250px] md:w-[300px] lg:w-[369px] h-auto top-[-30px] lg:top-[-50px] bg-[url(/Images/PromoBanner/banner-image-15-png.png)] bg-contain bg-no-repeat bg-center" />
          </div>

          {/* Middle section with text and button */}
          <div className="w-1/3 flex flex-col items-center justify-center pt-12">
            <div className="w-full text-center">
              <p className="[font-family:'PT_Sans',Helvetica] font-normal text-[#184363] text-sm tracking-[0] leading-[14px] mb-3.5">
                Pyridoxine Vitamin B6
              </p>
              <h3 className="[font-family:'PT_Sans',Helvetica] font-bold text-[#184363] text-[28px] tracking-[0] leading-9 mb-6">
                Vitamins &amp; Supplements
              </h3>
              <Link href="/shop">
                <Button className="bg-[#39cb74] text-white rounded-[72px] h-10 px-4 hover:bg-[#33b569]">
                  <span className="[font-family:'PT_Sans',Helvetica] font-bold text-[15px] tracking-[0] leading-[22px]">
                    View more
                  </span>
                  <ChevronRightIcon className="ml-2 h-4 w-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right section with image (banner-image-14) */}
          <div className="w-1/3 flex items-end justify-center">
            <div className="h-[37px] sm:h-[140px] md:h-[160px] lg:h-[200px] w-[120px] sm:w-[140px] md:w-[160px] lg:w-[30rem] bg-[url(/Images/PromoBanner/banner-image-14-png.png)] bg-contain bg-no-repeat bg-center" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
