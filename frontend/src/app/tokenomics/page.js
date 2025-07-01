// components/Tokenomics.js
"use client"
import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '@/components/Footer'; // Adjust the import based on your project structure

const navItems = [
  { text: "AI Features", href: "/signup" },
  { text: "Roadmap", href: "/roadmap" },
  { text: "Tokenomics", href: "/tokenomics" },
  { text: "Community", href: "/community" },
  { text: "Rewards", href: "/rewards" }
];

export default function Tokenomics() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="bg-indigo-900 backdrop-blur-md border-b border-indigo-800/50">
        <nav className="flex justify-between items-center py-2 px-2 md:px-12 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="">
              <Image
                src="/logo-main.png"
                alt="Finear"
                className="object-contain m-[20px]"
                width={100}
                height={100}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <ul className="flex gap-5">
              {navItems.map((page, index) => (
                <li key={index}>
                  <Link href={page.href} className="text-gray-300 hover:text-yellow-400 transition">
                    {page.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <Link href="/login">
              <button className="py-2 px-4 rounded-lg text-gray-200 hover:text-white transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2 rounded-lg bg-yellow-400 text-indigo-900 hover:bg-yellow-300 transition font-medium">
                Sign Up
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="block md:hidden text-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-indigo-800 shadow-lg z-50 md:hidden">
            <ul className="flex flex-col items-start gap-4 px-6 py-4">
              {navItems.map((page, index) => (
                <li key={index} className="w-full">
                  <Link href={page.href} className="block py-2 text-gray-200 hover:text-yellow-400 transition">
                    {page.text}
                  </Link>
                </li>
              ))}
              <div className="flex flex-col gap-4 w-full pt-4 border-t border-indigo-700">
                <Link href="/login" className="w-full">
                  <button className="py-2 rounded-lg w-full text-gray-200 hover:text-white transition">
                    Login
                  </button>
                </Link>
                <Link href="/signup" className="w-full">
                  <button className="py-2 rounded-xl bg-yellow-400 w-full text-indigo-900 hover:bg-yellow-300 transition font-medium">
                    Sign Up
                  </button>
                </Link>
              </div>
            </ul>
          </div>
        )}
      </header>
      <div className="bg-gray-300 text-white mt-7 mb-6 p-9 md:p-10 max-w-4xl mx-auto rounded-xl shadow-lg space-y-8">
        <h2 className="text-3xl flex flex-col items-center font-bold">Tokenomics Chart</h2>
        <p className="text-lg">
          <strong>Total Supply:</strong> <span className="text-green-400">1,000,000,000 tokens</span>
        </p>

        {/* Token Allocation Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left px-4 py-2">Allocation</th>
                <th className="text-left px-4 py-2">Percentage</th>
                <th className="text-left px-4 py-2">Tokens Allocated</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Community", percent: "90.0%", tokens: "900,000,000" },
                { name: "Reward Pool", percent: "0.5%", tokens: "10,000,000" },
                { name: "Marketing", percent: "0.2%", tokens: "7,000,000" },
                { name: "Team", percent: "8.3%", tokens: "83,000,000" },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.percent}</td>
                  <td className="px-4 py-2">{row.tokens} tokens</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lockup Details */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Team Allocation Lockup Details</h3>
          <ul className="list-disc list-inside space-y-2 text-black">
            <li>
              <strong>Team Allocation:</strong> 83,000,000 tokens (8.3% of total supply)
            </li>
            <li>
              <strong>Locked Tokens:</strong> 15,000,000 tokens (on Streamflow)
            </li>
            <li>
              <strong>Unlocked Team Tokens:</strong> 68,000,000 tokens
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}
