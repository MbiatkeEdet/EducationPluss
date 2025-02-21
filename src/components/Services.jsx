"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white bg-[url('/robot.jpg')] bg-cover">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BUILD, DEPLOY, AUTOMATE
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Launch and Orchestrate AI Agents
        </motion.p>
        <motion.p
          className="text-lg text-gray-400 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Zero Code. Unlimited Potential.
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Link href="/beta-access">
            <button className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition">
              Beta Access
            </button>
          </Link>
          <Link href="/documentation">
            <button className="px-6 py-3 border border-yellow-500 text-yellow-500 font-semibold rounded-lg hover:bg-yellow-500 hover:text-black transition">
              Documentation
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose Education+?</h2>
          <p className="text-gray-300 mb-10">
            Design, deploy, and manage AI agents with Education+ advanced tools.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Agentic AI Orchestration",
                desc: "Seamlessly manage AI agent workflows and automation.",
              },
              {
                title: "No Code Deployment",
                desc: "Easily launch AI agents without writing a single line of code.",
              },
              {
                title: "Hugging Face Integration",
                desc: "Access a vast library of AI models and tools.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-700 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Expertise</h2>
          <p className="text-gray-300 mb-10">
            We specialize in AI development, automation, and seamless integrations for businesses of all sizes.
          </p>
        </div>
      </section>
    </div>
  );
}
