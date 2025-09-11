import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-10">
      <div className="container mx-auto px-6 py-16">
        {/* Top Section with Logo and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-12 border-b border-blue-700/50">
          <div className="mb-8 md:mb-0">
            <Link href="/">
              <div className="bg-white p-3 rounded-xl shadow-lg transform transition-transform hover:scale-105">
                <img
                  src="/Images/CureZone Logo.png"
                  alt="CureZone Logo"
                  className="h-16"
                />
              </div>
            </Link>
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 ">
            <h3 className="text-lg font-bold mb-4">
              Subscribe to our newsletter
            </h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white text-black placeholder-blue-600/70 px-4 py-3 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-500 hover:bg-blue-400 transition-colors px-6 py-3 rounded-r-lg font-bold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-300 mt-1 flex-shrink-0" />
                <span className="text-blue-100">
                  123 Abdel Aziz, Al Saud St, Cairo Governorate 11553
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100">1900</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100">curezone@gmail.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 text-blue-300">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-blue-800/80 p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-5 w-5 text-blue-300" />
                </a>
                <a
                  href="#"
                  className="bg-blue-800/80 p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-blue-300" />
                </a>
                <a
                  href="#"
                  className="bg-blue-800/80 p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-blue-300" />
                </a>
                <a
                  href="#"
                  className="bg-blue-800/80 p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-blue-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">
              Information
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>About us</span>
                </Link>
              </li>
              {/* Delivery Information */}
              <li>
                <Link
                  href="/delivery"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Delivery information</span>
                </Link>
              </li>
              {/* Privacy Policy */}
              <li>
                <Link
                  href="/privacypolicy"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Privacy Policy</span>
                </Link>
              </li>

              {/* Contact Us */}
              <li>
                <Link
                  href="/contactus"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>My orders</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Account details</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Returns</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Wishlist</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Categories</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bestsellers"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Best Sellers</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/promotions"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>Promotions</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/new"
                  className="flex items-center text-blue-100 hover:text-white transition-colors"
                >
                  <span className="text-blue-400 mr-2">›</span>
                  <span>New Arrivals</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-700/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-blue-200 mb-4 md:mb-0">
            © 2024 Propharm. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
