"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Services() {
  // Testimonials data
  const testimonials = [
    {
      quote: "Education+ helped me improve my GPA from 3.2 to 3.8 in just one semester. The AI writing assistance and study tools are incredible!",
      name: "Alex Johnson",
      title: "Computer Science Student",
      avatar: "https://thispersondoesnotexist.com/"
    },
    {
      quote: "I've earned over 200 tokens by completing my study goals. The motivation to earn while learning has transformed my study habits.",
      name: "Mia Williams",
      title: "Business Major",
      avatar: "https://thispersondoesnotexist.com/"
    },
    {
      quote: "The exam prep feature helped me ace my finals. The personalized quizzes identified exactly what I needed to focus on.",
      name: "David Chen",
      title: "Pre-Med Student",
      avatar: "https://thispersondoesnotexist.com/"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
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
      <section className="py-20 px-6 bg-indigo-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Student Success Stories
            </h2>
            <p className="text-indigo-200 max-w-3xl mx-auto">
              Hear from students who have transformed their academic journey with Education+
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-indigo-800 p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 text-yellow-400">
                  {/* Star rating */}
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-white mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 overflow-hidden relative mr-3">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-indigo-300 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/signup">
              <button className="px-8 py-3 bg-yellow-400 text-indigo-900 font-semibold rounded-lg hover:bg-yellow-300 transition">
                Join Education+ Today
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}