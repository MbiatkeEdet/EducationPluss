"use client";
import Head from "next/head";

export default function StudyTools() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <Head>
        <title>Study Tools - Empower Your Learning Journey</title>
        <meta
          name="description"
          content="Discover our comprehensive Study Tools designed to enhance your learning experience with interactive flashcards, dynamic quizzes, personalized study plans, and more."
        />
      </Head>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-6">
          Study Tools: Empower Your Learning Journey
        </h1>
        <p className="mb-4">
          In our world of  competitive academic landscape, having the right tools can make all the difference. Our Study Tools are designed to be your ultimate academic companion, providing everything you need to master your subjects and achieve your goals.
        </p>
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Key Features:</h2>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>
            <span className="font-bold">Interactive Flashcards:</span> Enhance your memory with flashcards that help you review key concepts and definitions. Customize your decks or choose from a variety of pre-made sets.
          </li>
          <li>
            <span className="font-bold">Dynamic Quizzes:</span> Test your knowledge with quizzes that adapt to your learning progress. With instant feedback and detailed explanations, you can identify areas for improvement and track your growth.
          </li>
          <li>
            <span className="font-bold">Personalized Study Plans:</span> Create a study schedule that fits your lifestyle. Our AI-driven recommendations help you allocate time efficiently, ensuring that you focus on what matters most.
          </li>
          <li>
            <span className="font-bold">Comprehensive Note-Taking:</span> Organize your study materials with a built-in note-taking tool. Easily highlight important points, add annotations, and sync your notes across devices.
          </li>
          <li>
            <span className="font-bold">Progress Tracking:</span> Monitor your academic performance over time with detailed analytics. See your improvements and set achievable milestones to keep you motivated.
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">Why Choose Our Study Tools?</h2>
        <p className="mb-4">
          Our suite of Study Tools goes beyond simple organization it is about revolutionizing the way you learn. By combining smart technology with user-friendly design, we offer a personalized approach to education that empowers you to study smarter, not harder. Whether you're a student, a professional, or a lifelong learner, our tools are tailored to help you excel in every subject.
        </p>
        <p>
          Embrace the future of learning with our Study Tools and transform your academic journey today!
        </p>
      </div>
    </div>
  );
}
