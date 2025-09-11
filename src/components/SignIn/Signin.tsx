import Link from "next/link";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function Signin({}: Props) {
  return (
    <Link href="/signin">
      <button className="text-sl font-semibold hover:text-blue-700 text-lightColor hover:cursor-pointer hoverEffect">
        Login
      </button>
    </Link>
  );
}
