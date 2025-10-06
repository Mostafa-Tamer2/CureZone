import React from "react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
// interface LogoProps {
//   className?: string;
// }

export default function Logo() {
  return (
    <Link href="/" className="relative h-24 w-[180px]">
      <img
        className="absolute w-[234px] h-[179px] top-[-41px] -left-9"
        alt="Propharm Logo"
        src="/Images/CureZone Logo.png"
      />
    </Link>
  );
}
