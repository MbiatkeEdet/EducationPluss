"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
<<<<<<< HEAD:src/components/Navbar.jsx
    { text: "Home", href: "/"},
    { text: "Documentation", href: "/documentation" },
    { text: "Writing Help", href: "/writing-help" }, // Fixed space issue
    { text: "Task Manager", href: "/task-manager" },
    { text: "Study Tools", href: "/study-tools" },
    { text: "Exam Prep", href: "/exam-prep" },
    { text: "Settings", href: "/settings"}
  ];

  return (
    <header className="text-yellow-300 italic font-serif bg-whitec:\Users\Mbiatke Edet\Desktop\logo3.png shadow-md">
      <nav className="flex justify-between items-center py-4 px-4 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo7.jpg"
            alt="Education + Logo"
            width={90}
            height={90}
            className="w-28 md:w-36 rounded-xl"
            priority
          />
=======
    { text: "AI Features", href: "/features" },
    { text: "Roadmap", href: "/roadmap" },
    { text: "Rewards", href: "/rewards" },
    { text: "Community", href: "/community" }
  ];

  return (
    <header className="bg-indigo-900/50 backdrop-blur-md border-b border-indigo-800/50">
      <nav className="flex justify-between items-center py-4 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-36">
            <Image
              src="/logo7.png"
              alt="Education+ Logo"
              
              className="object-contain"
              width={80}
              height={80}
              priority
            />
          </div>
>>>>>>> 4ae207040ae3c5521eb0c2520bbdb7e24ff0718b:frontend/src/components/Navbar.jsx
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
  );
}