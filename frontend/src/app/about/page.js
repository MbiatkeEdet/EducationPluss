"use client";
import React from "react";
import { FaMountain } from "react-icons/fa";
import Navbar from "@/components/Navbar";

const About = () => {
  return (
    <section className="bg-indigo-900 py-16 px-6 md:px-20">
        <Navbar />
      {/* Header */}
      <div className="flex flex-col items-center space-x-4 mb-10">
        <FaMountain className="text-indigo-700 text-3xl" />
        <h2 className="text-3xl font-casual text-white">About Us</h2>
      </div>

      {/* Who We Are */}
      <div className="mb-12 flex flex-col items-center space-y-4">
        <h3 className="text-2xl font-semibold text-white mb-4">Who We Are</h3>
        <p className="text-white leading-relaxed">
          At <span className="font-semibold">Finear</span>, we are innovators redefining the future of learning. 
          Born from a vision to merge blockchain and AI, our mission is to transform how value is created, managed, and exchanged. 
          We’re building a platform that turns real-world assets into tokenized opportunities—bridging Web2 and Web3 with zero financial barriers.
        </p>
      </div>

      {/* What We Do */}
      <div className="mb-12">
        <h3 className="text-3xl flex flex-col items-center font-semibold text-white mb-4">What We Do</h3>
        <p className="text-white leading-relaxed mb-4">
          We bring the next generation of learning to life through a seamless, decentralized ecosystem. 
          Our platform empowers learners and educators with:
        </p>
        <ul className="list-disc list-inside text-white space-y-2">
          <li>
            <strong>Tokenized Assets:</strong> Access fractional ownership of real-world assets via secure digital tokens—making investing more accessible than ever.
          </li>
          <li>
            <strong>Decentralized Infrastructure:</strong> A community-governed protocol ensures a secure, adaptable, and transparent environment for financial activity.
          </li>
          <li>
            <strong>Seamless Apps:</strong> User-friendly mobile and web apps make investing in tokenized assets simple—even for those with no technical background.
          </li>
          <li>
            <strong>Inclusive Wealth Solutions:</strong> We democratize wealth management with faster, more transparent, and cost-efficient financial services tailored for today’s global market.
          </li>
        </ul>
      </div>

      {/* Why We Do It */}
      <div>
        <h3 className="text-5xl flex flex-col items-center font-semibold text-black mb-4">Why We Do It</h3>
        <p className="text-white leading-relaxed text-lg">
          We believe finance should be decentralized, secure, and accessible to all. 
          By tokenizing real assets, we’re eliminating traditional barriers, unlocking liquidity, and expanding opportunities. 
          Our goal: to become the world’s leading tokenized asset platform—fueling economic growth through innovation.
        </p>
      </div>
    </section>
  );
};

export default About
