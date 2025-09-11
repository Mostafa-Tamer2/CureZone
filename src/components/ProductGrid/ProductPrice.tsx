import React from "react";
import PriceFormater from "./PriceFormater";

interface Props {
  price: number | undefined;
  discount: number | null | undefined;
  className?: string;
}

export default function ProductPrice({ price, discount, className }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <PriceFormater amount={price} className="text-blue-700" />
      {price && discount && (
        <PriceFormater
          amount={price + (discount * price) / 100}
          className="text-lightColor line-through font-normal"
        />
      )}
    </div>
  );
}
