"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
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
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center">
          <ul className="flex gap-5">
            {navItems.map((page, index) => (
              <li key={index}>
                <Link href={page.href} className="hover:text-gray-600 transition">
                  {page.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <button className="py-2 px-4 rounded-lg border border-gray-300 hover:bg-black">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-black transition">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="block md:hidden"
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
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden">
          <ul className="flex flex-col items-start gap-4 px-6 py-4">
            {navItems.map((page, index) => (
              <li key={index}>
                <Link href={page.href} className="block py-2 text-black hover:text-gray-600 transition">
                  {page.text}
                </Link>
              </li>
            ))}
            <div className="flex flex-col gap-4 w-full">
              <Link href="/login">
                <button className="py-2 rounded-lg w-full text-black border border-gray-300 hover:bg-gray-100">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="py-2 rounded-xl bg-[#FFD700] w-full text-black hover:bg-yellow-400 transition">
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
