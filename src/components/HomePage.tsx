import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Note, HelpText } from '../types';
import StickyNote from './StickyNote';
import HelpModal from './HelpModal';
import { HelpCircle } from 'lucide-react';

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [helpText, setHelpText] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
        setNotes(notesArray.sort((a, b) => b.createdAt - a.createdAt));
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
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'cursive' }}>
            Sticky Flow
          </h1>
          <p className="text-xl text-gray-700">Your wall of memories and thoughts</p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            Help Me
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No notes yet. Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 items-start">
            {notes.map((note) => (
              <div key={note.id} className="animate-float">
                <StickyNote note={note} />
              </div>
            ))}
          </div>
        )}

        <footer className="text-center mt-16 pb-8">
          <p className="text-gray-600 text-sm">Made by Abdul Ahad..</p>
        </footer>
      </div>

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        helpText={helpText}
      />
    </div>
  );
}
