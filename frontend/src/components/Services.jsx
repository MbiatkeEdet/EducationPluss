"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Services() {
  

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-yellow-50">
      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI-powered learning tools with blockchain rewards to create a revolutionary educational experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Connect Your Wallet",
                desc: "Link your Solana wallet to start earning rewards for academic achievements."
              },
              {
                number: "02",
                title: "Use AI Tools",
                desc: "Leverage our suite of AI-powered learning assistants to improve your academic performance."
              },
              {
                number: "03",
                title: "Earn Rewards",
                desc: "Complete goals and milestones to earn tokens you can exchange or use within our ecosystem."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-6xl font-bold text-indigo-100 absolute -top-2 -right-2">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-4 relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-600 relative z-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-yellow-500 to-indigo-500">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              UTILITY
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">FIN TOKEN</h2>
            <p className="text-indigo-200 text-2xl max-w-3xl mx-auto">
              Launched fairly, FIN fuels our ecosystem, rewarding users for academic achievements and providing access to premium features.
            </p>
            <p className="text-indigo-200 text-2xl max-w-3xl mx-auto">
              The FIN token is your key to unlocking exclusive features, content, and rewards within the Finear ecosystem.
            </p>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/signup">
              <button className="px-8 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg hover:bg-yellow-300 transition">
                Join Finear Today
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}