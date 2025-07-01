
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '@/components/Footer'; // Adjust the import based on your project structure

const navItems = [
  { text: "AI Features", href: "/signup" },
  { text: "Roadmap", href: "/roadmap" },
  { text: "Rewards", href: "/rewards" },
  { text: "Community", href: "/community" }
];
  
export default function RoadmapPage() {
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
      <div className="bg-gray-100 min-h-screen">
        <div className="flex flex-col items-center sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 mt-2 sm:mb-8 text-center sm:text-left">🚀 ROAD-MAP</h1>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-4xl sm:text-2xl font-semibold mb-3 text-blue-700">Phase 1: MVP (Minimum Viable Product)</h2>
            <p className="mb-2 text-sm sm:text-base">Goal: Launch a lean, functional version to validate core demand and gather early feedback.</p>
            <h3 className="text-xl text-blue-400 sm:text-xl font-bold mt-4 mb-2 italic font-serif">✅ Core Features</h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li><strong>User Authentication & Profiles:</strong> Students sign up and set preferences (subjects, level).</li>
              <li><strong>AI Writing Assistant:</strong> Proofreading, grammar correction, basic structure suggestions.</li>
              <li><strong>AI-Powered Study Help:</strong> Chatbot that answers academic questions from selected subjects.</li>
              <li><strong>Task & Time Management Tool:</strong> To-do list with deadlines, reminders, and calendar view.</li>
            </ul>
            <h3 className="text-xl italic font-serif sm:text-xl font-bold text-blue-400 mt-4 mb-2">🎯 Key Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
              <li>Launch to early users (high school & college students).</li>
              <li>Collect analytics, feedback, and bug reports.</li>
            </ul>
          </section>

          <section className="mb-10 sm:mb-12">
            <h2 className="text-4xl text-blue-700 sm:text-2xl font-semibold mb-3">🧩 Phase 2: Full Launch</h2>
            <p className="mb-2 text-sm sm:text-base">Goal: Build full platform value, drive engagement, and prepare for partnerships or B2B pitch.</p>
            <h3 className="text-xl italic font-serif text-blue-400 sm:text-xl font-bold mt-4 mb-2">💡 Feature Additions</h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li><strong>AI Agent Creator (No-Code Builder):</strong> Templates, drag-and-drop logic builder.</li>
              <li><strong>AI-Summarizer & Flashcard Generator:</strong> Upload files to convert into study sets.</li>
              <li><strong>Smart Study Planner:</strong> Auto-suggest study blocks based on tasks and availability.</li>
              <li><strong>Multilingual Support (Beta):</strong> Support English + 1–2 other languages (e.g., Spanish, Hindi).</li>
              <li><strong>Leaderboards & Badges:</strong> Based on quiz scores, tasks, and study streaks.</li>
            </ul>
            <h3 className="text-xl italic font-serif text-blue-400 sm:text-xl font-bold mt-4 mb-2">🎯 Key Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
              <li>Onboard 5–10 institutions or student groups.</li>
              <li>Launch press/marketing campaign.</li>
              <li>Collect case studies and testimonials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-4xl text-blue-700 sm:text-2xl font-bold mb-3">🧠 Phase 3: V2 Expansion</h2>
            <p className="mb-2 text-sm sm:text-base">Goal: Scale the platform, expand into partnerships, and offer institutional-level tools.</p>
            <h3 className="text-xl italic font-serif text-blue-400 sm:text-xl font-bold mt-4 mb-2">🌍 Expansion Features</h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
              <li><strong>Offline Support / Lightweight Mobile App:</strong> AI tools work offline or on low bandwidth.</li>
              <li><strong>Peer Tutoring Marketplace:</strong> Users offer help for tokens, rated by peers.</li>
              <li><strong>Voice-to-Agent Tool:</strong> Convert spoken lessons into AI tutors.</li>
              <li><strong>Group Study Rooms:</strong> Real-time collaboration with whiteboard and shared notes.</li>
              <li><strong>AI Grader & Feedback System:</strong> Auto-grade essays with structure and clarity feedback.</li>
              <li><strong>LMS & API Integrations:</strong> Integrate with Moodle, Canvas, Google Classroom, etc.</li>
            </ul>
          </section>
        </div>
        {/* <Footer /> */}
      </div>
      <Footer />
    </>
  );
}