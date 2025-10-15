import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Info } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

interface NameEntryModalProps {
  onSubmit: (name: string, consentGeo: boolean) => void;
  isSubmitting: boolean;
}

export default function NameEntryModal({ onSubmit, isSubmitting }: NameEntryModalProps) {
  const [name, setName] = useState('');
  const [consentData, setConsentData] = useState(false);
  const [consentGeo, setConsentGeo] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!consentData) {
      setError('You must consent to data collection to continue');
      return;
    }

    setError('');
    onSubmit(name.trim(), consentGeo);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50 paper-texture"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 border-2 border-yellow-200"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col items-center mb-6">
            <div className="bg-yellow-400 p-4 rounded-full mb-4">
              <UserCircle className="w-12 h-12 text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-main-text">Welcome to Sticky Flow</h1>
            <p className="text-gray-600 text-center font-date-text">
              Please enter your name to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
                placeholder="Enter your name"
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentData"
                  checked={consentData}
                  onChange={(e) => {
                    setConsentData(e.target.checked);
                    setError('');
                  }}
                  className="mt-1 w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                  disabled={isSubmitting}
                />
                <label htmlFor="consentData" className="text-sm text-gray-700 flex-1">
                  I consent not to share these notes with the public (required) *
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentGeo"
                  checked={consentGeo}
                  onChange={(e) => setConsentGeo(e.target.checked)}
                  className="mt-1 w-5 h-5 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                  disabled={isSubmitting}
                />
                <label htmlFor="consentGeo" className="text-sm text-gray-700 flex-1">
                  I consent to share my opinion (optional)
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Info className="w-4 h-4" />
              What data do we collect?
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !consentData}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 rounded-lg transition-colors shadow-lg"
            >
              {isSubmitting ? 'Processing...' : 'Continue to Notes'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you acknowledge our data collection practices
            </p>
          </form>
        </motion.div>
      </motion.div>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}
