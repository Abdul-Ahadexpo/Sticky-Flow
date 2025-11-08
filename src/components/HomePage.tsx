import { useState, useEffect, useMemo } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Note } from '../types';
import StickyNote from './StickyNote';
import HelpModal from './HelpModal';
import { motion } from 'framer-motion';
import { sortNotesByDateAscending } from '../utils/dateSort';
import { Search, ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [helpText, setHelpText] = useState('Welcome to Sticky Flow — a wall of memories and thoughts.\n\nEach note carries meaning. The red bloody X marks moments of regret, danger, or unfinished memories.\n\nTap or click a note to flip and reveal what lies behind.');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'new-old' | 'old-new'>('new-old');

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

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes.filter((note) =>
      note.mainText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.hiddenDescription?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === 'old-new') {
      filtered = filtered.reverse();
    }

    return filtered;
  }, [notes, searchQuery, sortOrder]);

  return (
    <motion.div
      className="min-h-screen paper-texture"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full min-h-screen flex flex-col px-4 py-8 md:py-12">
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-[#212121] mb-2 md:mb-4 font-main-text" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
            Sticky Flow
          </h1>
          <p className="text-base md:text-xl text-gray-700 font-date-text">Your wall of memories and thoughts</p>
        </motion.div>

        {notes.length > 0 && (
          <motion.div
            className="flex flex-col md:flex-row gap-3 mb-6 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 font-main-text"
              />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'new-old' ? 'old-new' : 'new-old')}
              className="flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold rounded-lg transition-colors shadow-md whitespace-nowrap"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm">{sortOrder === 'new-old' ? 'Newest' : 'Oldest'}</span>
            </button>
          </motion.div>
        )}

        {filteredAndSortedNotes.length === 0 ? (
          <div className="text-center py-20 flex-1 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-gray-600 font-main-text">
              {notes.length === 0 ? 'No notes yet. Check back soon!' : 'No notes match your search.'}
            </p>
          </div>
        ) : (
          <div className="flex-1 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center auto-rows-max overflow-y-auto max-h-[calc(100vh-280px)] md:max-h-none md:overflow-y-visible">
              {filteredAndSortedNotes.map((note, index) => (
                <StickyNote key={note.id} note={note} index={index} />
              ))}
            </div>
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