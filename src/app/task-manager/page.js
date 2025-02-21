"use client";
import Head from "next/head";
import Link from "next/link";

export default function TaskManager() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
         <Link href="/" className="mt-4 inline-block bg-yellow-500 text-white px-4 py-2 rounded">
        Go to Home
      </Link>
      <Head>
        <title>Task Manager</title>
        <meta
          name="description"
          content="Task Manager: Your Personal Productivity Powerhouse. Boost productivity with smart scheduling, AI-driven suggestions, and more."
        />
      </Head>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Task Manager: Your Personal Productivity Powerhouse
        </h1>
        <p className="mb-4">
          In today,s  fast-paced world, staying organized is more crucial than ever. Our Task Manager is designed to be your ultimate companion in boosting productivity and ensuring that no task—big or small—falls through the cracks.
        </p>
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Key Features:</h2>
        <ul className="list-disc ml-6 space-y-2 mb-6">
          <li>
            <span className="font-bold">Intuitive Dashboard:</span> Enjoy a clean, user-friendly interface that lets you quickly add, view, and manage your tasks. With a modern design tailored for simplicity, you can focus on what truly matters.
          </li>
          <li>
            <span className="font-bold">Smart Scheduling:</span> Plan your day effortlessly. Set deadlines, create recurring tasks, and categorize your workload to keep your priorities in check.
          </li>
          <li>
            <span className="font-bold">AI-Driven Suggestions:</span> Harness the power of artificial intelligence to get smart recommendations on managing assignments and deadlines. Whether you're juggling multiple projects or planning your daily routine, our AI-powered insights help you optimize your schedule.
          </li>
          <li>
            <span className="font-bold">Real-Time Updates:</span> Stay in sync with your team or personal goals through instant notifications and seamless updates. Never miss a deadline again with our real-time tracking and reminders.
          </li>
          <li>
            <span className="font-bold">Cross-Platform Access:</span> Manage your tasks from anywhere—on your desktop, tablet, or mobile device. Our responsive design ensures a consistent experience, no matter how you access your tasks.
          </li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Why Choose Our Task Manager?</h2>
        <p className="mb-4">
          Our Task Manager is not just about listing tasks, it is about transforming the way you work. With integrated AI assistance, smart scheduling, and a beautifully simple interface, you can streamline your workflow, reduce stress, and focus on achieving your goals. Perfect for students, professionals, and teams, this tool is crafted to adapt to your unique needs and help you unlock your full potential.
        </p>
        <p>
          Embrace the future of productivity. Start organizing your life smarter, one task at a time.
        </p>
      </div>

      <button className='px-2 py-2 border border-black text-black bg-yellow-200 rounded-xl transition justify-items-center gap-2 mt-4'>Get Started</button>
    </div>
  );
}
