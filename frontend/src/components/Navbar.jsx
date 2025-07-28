"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  const navItems = [
    // { text: "AI Features", href: "/signup" },
    { text: "Roadmap", href: "/roadmap" },
    { text: "Tokenomics", href: "/tokenomics" },
    { text: "Community", href: "/community" },
    { text: "Rewards", href: "/rewards" },
    
  ];

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Dynamic navbar styles based on route
  const navbarClasses = isHomePage 
    ? "bg-indigo-900/50 backdrop-blur-md border-b border-indigo-800/50"
    : "bg-indigo-600 shadow-sm border-b border-indigo-700";

  const logoClasses = isHomePage 
    ? "object-contain m-[20px]"
    : "object-contain m-[20px]";

  const navLinkClasses = isHomePage
    ? "text-gray-300 hover:text-yellow-400 transition"
    : "text-white hover:text-yellow-400 transition";

  const mobileMenuClasses = isHomePage
    ? "absolute top-16 left-0 w-full bg-indigo-800 shadow-lg z-50 md:hidden"
    : "absolute top-16 left-0 w-full bg-indigo-700 shadow-lg z-50 md:hidden border-t border-indigo-600";

  const mobileLinkClasses = isHomePage
    ? "block py-2 text-gray-200 hover:text-yellow-400 transition"
    : "block py-2 text-white hover:text-yellow-400 transition";

  const mobileButtonColor = isHomePage ? "text-gray-200" : "text-white";

  return (
    <header className={navbarClasses}>
      <nav className="flex justify-between items-center py-2 px-2 md:px-12 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div>
            <Image
              src="/logo-main.png"
              alt="Finear"
              className={logoClasses}
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
                <Link href={page.href} className={navLinkClasses}>
                  {page.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Auth Buttons */}
        {/* <div className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <span className={`text-sm ${isHomePage ? 'text-gray-200' : 'text-white'}`}>
                Hi, {user?.name || 'User'}!
              </span>
              
              <Link href="/dashboard">
                <button className={`px-6 py-2 rounded-lg font-medium transition ${
                  isHomePage 
                    ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300' 
                    : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'
                }`}>
                  Dashboard
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className={`py-2 px-4 rounded-lg transition ${
                  isHomePage 
                    ? 'text-gray-200 hover:text-white' 
                    : 'text-white hover:text-yellow-400'
                }`}>
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className={`px-6 py-2 rounded-lg font-medium transition ${
                  isHomePage 
                    ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300' 
                    : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'
                }`}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div> */}

        {/* Mobile Menu Button */}
        <button
          className={`block md:hidden ${mobileButtonColor}`}
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
        <div className={mobileMenuClasses}>
          <ul className="flex flex-col items-start gap-4 px-6 py-4">
            {navItems.map((page, index) => (
              <li key={index} className="w-full">
                <Link href={page.href} className={mobileLinkClasses}>
                  {page.text}
                </Link>
              </li>
            ))}
            {/* <div className={`flex flex-col gap-4 w-full pt-4 border-t ${
              isHomePage ? 'border-indigo-700' : 'border-indigo-600'
            }`}>
              {isLoggedIn ? (
                <>
                  <div className={`text-sm ${isHomePage ? 'text-gray-200' : 'text-white'}`}>
                    Hi, {user?.name || 'User'}!
                  </div>
                  <Link href="/dashboard" className="w-full">
                    <button className={`py-2 rounded-lg w-full font-medium transition ${
                      isHomePage 
                        ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300' 
                        : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'
                    }`}>
                      Dashboard
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="w-full">
                    <button className={`py-2 rounded-lg w-full transition ${
                      isHomePage 
                        ? 'text-gray-200 hover:text-white' 
                        : 'text-white hover:text-yellow-400'
                    }`}>
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <button className={`py-2 rounded-lg w-full font-medium transition ${
                      isHomePage 
                        ? 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300' 
                        : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'
                    }`}>
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div> */}
          </ul>
        </div>
      )}
    </header>
  );
}