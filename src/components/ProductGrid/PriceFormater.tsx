import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}

export default function PriceFormater({ amount, className }: Props) {
  const formattedPrice = new Number(amount).toLocaleString("eg-EG", {
    currency: "EGP",
    style: "currency",
    minimumFractionDigits: 2,
  });
  return (
    <span className={twMerge("text-sm font-semibold text-black", className)}>
      {formattedPrice}
    </span>
  );
}
