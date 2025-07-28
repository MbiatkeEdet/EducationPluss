"use client";
import Link from 'next/link';
import { motion } from "framer-motion";
import { FaRobot, FaTasks, FaGraduationCap, FaCoins } from "react-icons/fa";

function Product() {
  const features = [
    {
      icon: <FaRobot className="text-4xl text-indigo-500" />,
      title: "AI Writing Assistant",
      description: "Improve your essays, reports, and writing projects with AI-powered proofreading and suggestions.",
      link: "/#",
      color: "bg-indigo-50"
    },
    {
      icon: <FaTasks className="text-4xl text-purple-500" />,
      title: "Smart Task Planner",
      description: "Manage assignments, deadlines, and schedules with AI suggestions that adapt to your learning style.",
      link: "/#",
      color: "bg-purple-50"
    },
    {
      icon: <FaGraduationCap className="text-4xl text-blue-500" />,
      title: "Exam Prep & Quizzes",
      description: "Practice with AI-generated quizzes and personalized study plans tailored to your knowledge gaps.",
      link: "/#",
      color: "bg-blue-50"
    },
    {
      icon: <FaCoins className="text-4xl text-yellow-500" />,
      title: "Crypto Rewards",
      description: "Earn tokens on the Solana blockchain for completing tasks and achieving your learning goals.",
      link: "/#",
      color: "bg-yellow-50"
    }
  ];

  return (
    <>
      <link rel="stylesheet" href="#" />
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Tools for Academic Excellence</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you excel in your studies while earning rewards for every milestone you achieve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`${feature.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Link href={feature.link}>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                    Learn More
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <link rel="stylesheet" href="#" />
    </>
  );
}

export default Product;