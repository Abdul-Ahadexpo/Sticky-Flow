import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Note } from '../types';
import StickyNote from './StickyNote';
import MobileStickyStack from './MobileStickyStack';
import HelpModal from './HelpModal';
import { motion } from 'framer-motion';
import { sortNotesByDateAscending } from '../utils/dateSort';

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [helpText, setHelpText] = useState('Welcome to Sticky Flow — a wall of memories and thoughts.\n\nEach note carries meaning. The red bloody X marks moments of regret, danger, or unfinished memories.\n\nTap or click a note to flip and reveal what lies behind.');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const notesRef = ref(database, 'notes');
    const helpRef = ref(database, 'help');

    onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notesArray = Object.entries(data).map(([id, note]) => ({
          id,
          ...(note as Omit<Note, 'id'>),
        }));
        const sortedNotes = sortNotesByDateAscending(notesArray);
        setNotes(sortedNotes);
      } else {
        setNotes([]);
      }
    });

    onValue(helpRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.content) {
        setHelpText(data.content);
      }
    });
  }, []);

  return (
    <motion.div
      className="min-h-screen paper-texture"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#212121] mb-2 md:mb-4 font-main-text" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            Sticky Flow
          </h1>
          <p className="text-lg md:text-xl text-gray-700 font-date-text">Your wall of memories and thoughts</p>
        </motion.div>

        {notes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 font-main-text">No notes yet. Check back soon!</p>
          </div>
        ) : isMobile ? (
          <MobileStickyStack notes={notes} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 justify-items-center max-w-7xl mx-auto">
            {notes.map((note, index) => (
              <StickyNote key={note.id} note={note} index={index} />
            ))}
          </div>
        )}

        <footer className="text-center mt-12 md:mt-16 pb-8">
          <p className="text-gray-600 text-sm font-date-text">Made by Abdul Ahad..</p>
        </footer>
      </div>

      <motion.button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <span className="text-3xl font-bold">?</span>
      </motion.button>

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        helpText={helpText}
      />
    </motion.div>
  );
}