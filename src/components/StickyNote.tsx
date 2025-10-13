import { useState } from 'react';
import { X } from 'lucide-react';
import { Note } from '../types';

interface StickyNoteProps {
  note: Note;
}

export default function StickyNote({ note }: StickyNoteProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const randomRotation = Math.random() * 6 - 3;
  const randomColor = ['#fef08a', '#fde047', '#facc15', '#fef3c7'][Math.floor(Math.random() * 4)];

  return (
    <div
      className="perspective-1000 w-64 h-64"
      style={{ transform: `rotate(${randomRotation}deg)` }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front side */}
        <div
          className="absolute w-full h-full backface-hidden p-6 shadow-lg hover:shadow-xl transition-shadow"
          style={{
            backgroundColor: randomColor,
            boxShadow: '3px 3px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex flex-col h-full font-handwriting">
            <div className="flex-1 overflow-hidden">
              <p className="text-gray-800 text-lg leading-relaxed break-words whitespace-pre-wrap">
                {note.mainText}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-400/30 flex items-center justify-between">
              <span className="text-sm text-gray-600">{note.date}</span>
              {note.markWithX && (
                <div className="bg-red-600 p-1 rounded">
                  <X className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back side */}
        <div
          className="absolute w-full h-full backface-hidden rotate-y-180 p-6 shadow-lg"
          style={{
            backgroundColor: randomColor,
            boxShadow: '3px 3px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex flex-col h-full font-handwriting">
            <div className="flex-1 overflow-auto">
              <p className="text-gray-800 text-lg leading-relaxed break-words whitespace-pre-wrap">
                {note.hiddenDescription || 'No hidden description'}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-400/30">
              <p className="text-xs text-gray-500 italic">Click to flip back</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
