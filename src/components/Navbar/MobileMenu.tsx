"use client";
import React, { useState } from "react";
import { AlignLeft } from "lucide-react";
import SideMenu from "./SideMenu";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function MobileMenu({}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkColor hoverEffect md:hidden hover:cursor-pointer" />
      </button>
      <div className="md:hidden">
        <SideMenu
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
}
