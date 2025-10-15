import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 font-main-text">Privacy & Data Collection</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">What We Collect</h3>
                  <p className="mb-2">
                    By entering your name and consenting, you agree that Sticky Flow may collect the following data:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Display name you provide</li>
                    <li>Timestamp of your visit</li>
                    <li>Browser information (user agent, browser name, platform)</li>
                    <li>Screen and viewport dimensions</li>
                    <li>Language and timezone settings</li>
                    <li>Device capabilities (memory, CPU cores, touch support)</li>
                    <li>Network connection type</li>
                    <li>Battery status (if available)</li>
                    <li>IP address (for security and analytics)</li>
                    <li>Page referrer (where you came from)</li>
                    <li>Cookie settings status</li>
                    <li>Approximate location (only if you explicitly grant permission)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Why We Collect This Data</h3>
                  <p className="text-sm">
                    We collect this information to improve our service, understand our audience,
                    monitor site performance, and for administrative monitoring purposes. This helps
                    us provide a better experience for all visitors.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Your Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>You can decline geolocation permission and still access the site</li>
                    <li>Your data is stored securely in Firebase Realtime Database</li>
                    <li>The site admin can view and remove visitor entries</li>
                    <li>We do not attempt to access or store sensitive private data</li>
                    <li>No personally identifiable information beyond your provided name is collected</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm font-medium text-gray-900">
                    <strong>Important Notice:</strong> If you do not consent to data collection, you may leave the site.
                    By proceeding, you acknowledge and accept this data collection policy.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Data Retention</h3>
                  <p className="text-sm">
                    Visitor data is retained indefinitely for analytics purposes unless manually removed by the site administrator.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">Contact</h3>
                  <p className="text-sm">
                    For questions about your data or to request removal, please contact the site administrator.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
