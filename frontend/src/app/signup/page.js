"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await fetch("http://localhost:3002/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Handle successful registration
      console.log("Registration successful:", data);
      setSuccess(true);
      
      // Store the token in localStorage
      localStorage.setItem("token", data.token);
      
      // Store user data if needed
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
      
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-indigo-900 to-black">
      {/* Right side with image - only visible on lg screens and up */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-900 to-transparent z-10" />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/robot.jpg"
            alt="AI Education Platform"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        {/* Overlay content on image */}
        <div className="absolute z-20 bottom-0 left-0 right-0 p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-indigo-200 text-lg mb-6">
              Start your AI-powered educational journey today and earn rewards while you learn.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((user) => (
                  <div key={user} className="w-8 h-8 rounded-full border-2 border-indigo-900 overflow-hidden bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-900">{user}</span>
                  </div>
                ))}
              </div>
              <span className="text-white">Join 10,000+ students already learning</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Left side with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <Link href="/">
              <div className="relative h-12 w-44">
                <Image
                  src="/logo7.png"
                  alt="Education+"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          
          {/* Title */}
          <div className="text-center mb-2">
            <h1 className="text-xl font-bold text-white">Create Account</h1>
            <p className="text-indigo-300 mt-2">Sign up to start your personalized learning experience</p>
          </div>
          
          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-6 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg mb-6 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Account created successfully! Redirecting to dashboard...</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white mb-2 font-medium">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-indigo-300" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading || success}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-indigo-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-indigo-300" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading || success}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-indigo-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-indigo-300" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading || success}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-indigo-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
                    placeholder="Create a password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-indigo-300" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading || success}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-indigo-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-indigo-300"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-indigo-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-indigo-200">
                  I agree to the <Link href="/terms" className="text-yellow-400 hover:text-yellow-300">Terms of Service</Link> and <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300">Privacy Policy</Link>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 text-indigo-900 py-3 rounded-lg hover:bg-yellow-300 transition font-medium flex items-center justify-center gap-2"
                disabled={loading || success}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-indigo-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-indigo-200">
                Already have an account?{" "}
                <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Login
                </Link>
              </p>
            </div>
            
            {/* Social Login Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-indigo-300/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-indigo-900/50 text-indigo-200">Or sign up with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-indigo-300/30 rounded-lg shadow-sm bg-white/5 hover:bg-white/10 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.908 8.908 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-indigo-300/30 rounded-lg shadow-sm bg-white/5 hover:bg-white/10 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 20 3.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 .8 7.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.095 4.095 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 16.407a11.615 11.615 0 0 0 6.29 1.84"></path>
                  </svg>
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-indigo-300/30 rounded-lg shadow-sm bg-white/5 hover:bg-white/10 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 10 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 20 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}