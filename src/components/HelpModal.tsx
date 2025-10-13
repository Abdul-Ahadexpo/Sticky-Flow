import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  helpText: string;
}

export default function HelpModal({ isOpen, onClose, helpText }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-yellow-50 to-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border-2 border-yellow-200"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b-2 border-yellow-200 bg-yellow-100">
              <h2 className="text-3xl font-bold text-[#212121] font-main-text">Help & Information</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-yellow-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(80vh-100px)]">
              <div className="prose prose-lg max-w-none">
                <p className="text-[#212121] text-lg leading-relaxed whitespace-pre-wrap font-main-text">
                  {helpText || 'Welcome to Sticky Flow — a wall of memories and thoughts.\n\nEach note carries meaning. The red bloody X marks moments of regret, danger, or unfinished memories.\n\nTap or click a note to flip and reveal what lies behind.'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
