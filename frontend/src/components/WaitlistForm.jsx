"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaUser, FaCheck, FaSpinner, FaGift } from 'react-icons/fa';
import { FaTelegram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useSearchParams } from 'next/navigation';

export default function WaitlistForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    socialHandle: '',
    socialPlatform: 'x',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [waitlistPosition, setWaitlistPosition] = useState(null);
  const [referralBonus, setReferralBonus] = useState(0);
  const [userReferralCode, setUserReferralCode] = useState('');

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({
        ...prev,
        referralCode: refCode.toUpperCase()
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setWaitlistPosition(data.data.position);
        setReferralBonus(data.data.referralBonus || 0);
        setUserReferralCode(data.data.referralCode);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyReferralLink = () => {
    const referralUrl = `${window.location.origin}/?ref=${userReferralCode}`;
    navigator.clipboard.writeText(referralUrl);
    // You could add a toast notification here
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FaCheck className="text-green-600 text-2xl" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to the Waitlist! 🎉
          </h3>
          
          <p className="text-gray-600 mb-4">
            You're #{waitlistPosition} in line for early access to Finear
            {referralBonus > 0 && (
              <span className="block text-green-600 text-sm mt-1">
                🎁 Referral bonus: Moved up {referralBonus} positions!
              </span>
            )}
          </p>
          
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-700 mb-3">
              Check your email for confirmation and your personal referral link!
            </p>
            
            {/* Referral Section */}
            <div className="bg-white rounded-lg p-3 border-2 border-dashed border-indigo-300">
              <p className="text-xs text-indigo-600 mb-2">Share your referral link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/?ref=${userReferralCode}`}
                  readOnly
                  className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
                />
                <button
                  onClick={copyReferralLink}
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ email: '', socialHandle: '', socialPlatform: 'x', referralCode: '' });
              setWaitlistPosition(null);
              setReferralBonus(0);
              setUserReferralCode('');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Join another person
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Join the Waitlist
        </h3>
        <p className="text-gray-600">
          Be among the first to experience AI-powered learning with crypto rewards
        </p>
        {formData.referralCode && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700 flex items-center justify-center gap-2">
              <FaGift /> Referral code applied! You'll move up 5 positions
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Social Platform Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({...formData, socialPlatform: 'x'})}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                formData.socialPlatform === 'x'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FaXTwitter />
              <span>X (Twitter)</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, socialPlatform: 'telegram'})}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition ${
                formData.socialPlatform === 'telegram'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FaTelegram />
              <span>Telegram</span>
            </button>
          </div>
        </div>

        {/* Social Handle Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.socialPlatform === 'telegram' ? 'Telegram Username' : 'X Handle'}
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="socialHandle"
              value={formData.socialHandle}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={formData.socialPlatform === 'telegram' ? '@username' : '@handle'}
            />
          </div>
        </div>

        {/* Referral Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Referral Code (Optional)
          </label>
          <div className="relative">
            <FaGift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter referral code"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Have a referral code? Move up 5 positions on the waitlist!
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Joining Waitlist...
            </>
          ) : (
            'Join Waitlist'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By joining, you'll receive updates about early access and product launches
        </p>
      </div>
    </motion.div>
  );
}