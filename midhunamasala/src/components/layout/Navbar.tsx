'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-gray-900">
                MasalaHeritage
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-blue-500 font-medium text-sm hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/feedback"
              className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors"
            >
              Feedback
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for masalas..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
