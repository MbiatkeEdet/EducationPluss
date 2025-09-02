"use client";
import React, { useState } from 'react';
import { MdEmail, MdPhone, MdLocationOn, MdSend } from 'react-icons/md';
import { FaTelegramPlane } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import Navbar from '@/components/Navbar';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your form submission logic here
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form or show success message
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <MdEmail className="text-2xl" />,
      title: "Email Us",
      detail: "finear.app@gmail.com",
      href: "mailto:finear.app@gmail.com"
    },
    {
      icon: <FaTelegramPlane className="text-2xl" />,
      title: "Telegram",
      detail: "@Finear_app",
      href: "https://t.me/Finear_app"
    },
    {
      icon: <BsTwitterX className="text-2xl" />,
      title: "Twitter",
      detail: "@Finear_app",
      href: "https://www.twitter.com/@Finear_app"
    }
  ];

  return (
    <div className="bg-indigo-900 min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get in <span className="text-yellow-400">Touch</span>
            </h1>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
              Have questions about Finear? Want to join our mission of revolutionizing education with AI and blockchain? We&#39;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-indigo-800">
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-indigo-200 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-indigo-200 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-indigo-200 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-indigo-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-900"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <MdSend className="text-lg" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Other Ways to Reach Us</h2>
                <div className="space-y-6">
                  {contactInfo.map((contact, index) => (
                    <a
                      key={index}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-indigo-800 hover:bg-white/20 transition-all duration-200 group"
                    >
                      <div className="text-yellow-400 group-hover:text-yellow-300 transition-colors">
                        {contact.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{contact.title}</h3>
                        <p className="text-indigo-200 group-hover:text-white transition-colors">
                          {contact.detail}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-indigo-800">
                <h3 className="text-xl font-semibold text-white mb-6">Quick FAQ</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">When will Finear launch?</h4>
                    <p className="text-indigo-200 text-sm">We&#39;re currently in development. Join our waitlist to be the first to know about our launch date.</p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">How can I get involved?</h4>
                    <p className="text-indigo-200 text-sm">Follow us on social media and join our community channels for updates and early access opportunities.</p>
                  </div>
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Is Finear free to use?</h4>
                    <p className="text-indigo-200 text-sm">We&#39;ll have both free and premium features. Stay tuned for more details about our pricing structure.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;