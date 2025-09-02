"use client";
import React from "react";
import { FaRocket, FaUsers, FaLightbulb, FaGlobe, FaShieldAlt, FaMountain } from "react-icons/fa";
import { MdSchool, MdTrendingUp, MdSecurity } from "react-icons/md";
import Navbar from "@/components/Navbar";

const About = () => {
  const features = [
    {
      icon: <MdSchool className="text-3xl" />,
      title: "AI-Powered Learning",
      description: "Advanced AI tools that adapt to your learning style and help you achieve academic excellence."
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Blockchain Security",
      description: "Secure, transparent, and decentralized infrastructure protecting your data and rewards."
    },
    {
      icon: <MdTrendingUp className="text-3xl" />,
      title: "Earn While Learning",
      description: "Revolutionary reward system that lets you earn cryptocurrency as you study and improve."
    },
    {
      icon: <FaGlobe className="text-3xl" />,
      title: "Global Community",
      description: "Join a worldwide network of learners, educators, and innovators shaping the future of education."
    }
  ];

  const values = [
    {
      icon: <FaLightbulb className="text-2xl" />,
      title: "Innovation",
      description: "We continuously push boundaries to create cutting-edge educational solutions."
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Accessibility",
      description: "Making quality education and financial opportunities available to everyone, everywhere."
    },
    {
      icon: <MdSecurity className="text-2xl" />,
      title: "Trust",
      description: "Building transparent, secure systems that users can rely on for their educational journey."
    }
  ];

  return (
    <div className="bg-indigo-900 min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="flex justify-center items-center mb-6">
              <FaMountain className="text-yellow-400 text-4xl mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                About <span className="text-yellow-400">Finear</span>
              </h1>
            </div>
            <p className="text-xl text-indigo-200 max-w-4xl mx-auto leading-relaxed">
              We&#39;re revolutionizing education by merging AI-powered learning tools with blockchain technology, 
              creating an ecosystem where students can excel academically while earning cryptocurrency rewards.
            </p>
          </div>

          {/* Who We Are Section */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Who We <span className="text-yellow-400">Are</span>
                </h2>
                <p className="text-indigo-200 text-lg leading-relaxed mb-6">
                  At <span className="font-semibold text-white">Finear</span>, we are innovators redefining the future of learning. 
                  Born from a vision to merge blockchain and AI, our mission is to transform how educational value is created, 
                  managed, and rewarded.
                </p>
                <p className="text-indigo-200 text-lg leading-relaxed">
                  We&#39;re building a platform that bridges Web2 and Web3 education, making advanced learning tools 
                  accessible to students worldwide while providing tangible rewards for academic achievements.
                </p>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-indigo-900 rounded-xl p-8 -rotate-3">
                    <FaRocket className="text-yellow-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-white text-xl font-semibold text-center">
                      Launching the Future of Education
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What We <span className="text-yellow-400">Do</span>
              </h2>
              <p className="text-indigo-200 text-lg max-w-3xl mx-auto">
                We bring the next generation of learning to life through a seamless, decentralized ecosystem 
                that empowers learners and educators worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-indigo-800 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="text-yellow-400 group-hover:text-yellow-300 transition-colors mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-indigo-200 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why We Do It Section */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-indigo-800 to-purple-900 rounded-3xl p-12 border border-indigo-700">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Why We <span className="text-yellow-400">Do It</span>
                </h2>
                <p className="text-indigo-200 text-lg max-w-4xl mx-auto leading-relaxed">
                  We believe education should be decentralized, rewarding, and accessible to all. 
                  By combining AI-powered learning with blockchain rewards, we&#39;re eliminating traditional barriers 
                  and creating new opportunities for students worldwide.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-indigo-900">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                    <p className="text-indigo-200">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-indigo-800">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our <span className="text-yellow-400">Mission</span>
            </h2>
            <p className="text-xl text-indigo-200 max-w-4xl mx-auto leading-relaxed mb-8">
              To become the world&#39;s leading educational platform that seamlessly integrates AI-powered learning 
              with blockchain technology, empowering students to achieve academic excellence while earning 
              cryptocurrency rewards for their efforts.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <div className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg font-semibold">
                🎓 10M+ Students Empowered
              </div>
              <div className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg font-semibold">
                🚀 AI-Powered Learning
              </div>
              <div className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-lg font-semibold">
                💰 Crypto Rewards System
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
