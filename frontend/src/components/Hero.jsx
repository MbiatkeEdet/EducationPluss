"use client";
import Navbar from "./Navbar";
import WaitlistForm from "./WaitlistForm";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="bg-indigo-900 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-8 px-8 md:px-12 text-center lg:text-left max-w-7xl mx-auto">
<h1 className="text-white font-bold text-2xl md:text-4xl lg:text-5xl leading-tight p-2 text-center">
            AI-Powered Learning, <span className="text-yellow-400">Crypto Rewards</span>
          </h1>
          <p className="text-gray-300 md:text-xl leading-relaxed text-center">
            Revolutionize your learning experience with our AI-driven toolkit. Master your studies, streamline your writing, and earn crypto rewards for achieving your educational goals.
          </p>      </div>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 md:px-12 pb-16 max-w-7xl mx-auto">
        {/* Left Content */}
        
        <motion.div
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.9 }}
          className="space-y-6 text-center lg:text-left"
        >
          
          
          {/* Waitlist Form */}
          <div className="pt-6 relative z-20">
            <WaitlistForm />
          </div>
          
          <div className="pt-6 text-gray-400 text-sm text-center">
            <p>Join over 10,000 students waiting for early access</p>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full h-[500px] md:h-[600px]"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-transparent z-10 rounded-2xl" />
          
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/robotgirl.jpg"
              alt="Student using AI learning platform"
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Floating UI Elements */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-xl z-20 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-400 flex items-center justify-center">
                <span className="text-green-900 text-xs font-bold">+5</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Goal Reached!</p>
                <p className="text-xs text-gray-300">Completed study session - earned 5 tokens</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </section>
  );
}