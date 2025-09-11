import React, { FC, useEffect } from "react";
import Logo from "./Logo";
import { X } from "lucide-react";
import { navLinks } from "@/constraints/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOutsideClick } from "../hooks/index";
import { motion } from "framer-motion";
import SocialMedia from "../SocialMedia/ScoialMedia";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarRef = useOutsideClick<HTMLDivElement>(onClose);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const sidebarVariants = {
    hidden: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.div
      initial={isOpen ? "hidden" : "visible"}
      animate={isOpen ? "visible" : "hidden"}
      exit="hidden"
      variants={backdropVariants}
      style={{ zIndex: 99999 }} // Inline style for max z-index
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex ${
        !isOpen ? "pointer-events-none" : ""
      }`}
    >
      <motion.div
        ref={sidebarRef}
        variants={sidebarVariants}
        style={{ zIndex: 100000, height: "100vh" }} // Inline style for max z-index and full height
        className="w-full max-w-xs bg-white shadow-2xl flex flex-col relative"
      >
        {/* Header with logo and close button */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <Logo />
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {navLinks?.map((item, i) => (
              <motion.div
                key={item?.title}
                custom={i}
                variants={navItemVariants}
              >
                <Link
                  href={item?.href}
                  className={`block py-3 px-4 rounded-md font-medium text-base transition-all duration-300 ${
                    pathname === item?.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  {item?.title}
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Social Media Icons - Matching your current design */}
        <div className="py-4 px-5 border-t border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center space-x-4"
          >
            <SocialMedia />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-5 text-sm text-center text-blue-800 font-medium"
          >
            © {new Date().getFullYear()} CUREZONE PHARMACY
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SideMenu;
