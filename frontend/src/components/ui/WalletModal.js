import { useState } from 'react';
import { X, Wallet, AlertCircle, CheckCircle } from 'lucide-react';

export default function WalletModal({ isOpen, onClose, onWalletConnected }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input'); // 'input', 'verifying', 'success'

  const validateSolanaAddress = (address) => {
    // Basic Solana address validation (58 characters, base58)
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return address.length >= 32 && address.length <= 44 && base58Regex.test(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateSolanaAddress(walletAddress)) {
      setError('Please enter a valid Solana wallet address');
      return;
    }

    setIsLoading(true);
    setStep('verifying');

    try {
      // Add wallet address
      const addResponse = await fetch('/api/wallet/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ address: walletAddress })
      });

      const addData = await addResponse.json();

      if (!addResponse.ok) {
        throw new Error(addData.message || 'Failed to add wallet address');
      }

      // Verify wallet ownership
      const verifyResponse = await fetch('/api/wallet/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ address: walletAddress })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || 'Failed to verify wallet');
      }

      setStep('success');
      
      // Call the callback to update parent component
      if (onWalletConnected) {
        onWalletConnected(walletAddress);
      }

      // Close modal after a brief delay
      setTimeout(() => {
        onClose();
        setStep('input');
        setWalletAddress('');
      }, 2000);

    } catch (error) {
      setError(error.message);
      setStep('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setStep('input');
      setWalletAddress('');
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Connect Solana Wallet
            </h2>
          </div>
          {!isLoading && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content based on step */}
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your Solana wallet address..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This address will be used to receive your EPlus tokens
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 
                         dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !walletAddress.trim()}
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </form>
        )}

        {step === 'verifying' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Verifying Wallet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we verify your wallet address...
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Wallet Connected Successfully!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your Solana wallet has been connected and verified.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}