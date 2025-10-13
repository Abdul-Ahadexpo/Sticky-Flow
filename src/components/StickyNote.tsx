import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Note } from '../types';
import BloodyX from './BloodyX';

interface StickyNoteProps {
  note: Note;
  index: number;
}

export default function StickyNote({ note, index }: StickyNoteProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const randomValues = useMemo(() => ({
    rotation: Math.random() * 8 - 4,
    color: '#FFEB3B',
    delay: Math.random() * 2,
    swayDuration: 8 + Math.random() * 4,
  }), []);

  return (
    <motion.div
      className="perspective-1000 w-64 h-64"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: [
          randomValues.rotation,
          randomValues.rotation + 1.5,
          randomValues.rotation - 1.5,
          randomValues.rotation,
        ],
        x: [0, 3, -3, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.05 },
        y: { duration: 0.5, delay: index * 0.05 },
        rotate: {
          duration: randomValues.swayDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: randomValues.delay,
        },
        x: {
          duration: randomValues.swayDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: randomValues.delay,
        },
      }}
      whileHover={{
        scale: 1.05,
        rotate: randomValues.rotation + 2,
        transition: { duration: 0.2 },
      }}
    >
      <motion.div
        className={`relative w-full h-full transform-style-3d cursor-pointer`}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Tape mark */}
        <div className="tape-mark" />

        {/* Front side */}
        <div
          className="absolute w-full h-full backface-hidden p-6 sticky-note-shadow rounded-sm"
          style={{
            backgroundColor: randomValues.color,
            borderRight: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '2px solid rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              <p className="text-[#212121] text-xl leading-relaxed break-words whitespace-pre-wrap font-main-text">
                {note.mainText}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2" style={{ borderColor: '#FBC02D' }}>
              <div className="flex items-center justify-between">
                {note.markWithX && (
                  <BloodyX />
                )}
                <span className="text-sm text-[#212121] font-date-text ml-auto">
                  {note.date}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Back side */}
        <div
          className="absolute w-full h-full backface-hidden rotate-y-180 p-6 sticky-note-shadow rounded-sm"
          style={{
            backgroundColor: randomValues.color,
            borderRight: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '2px solid rgba(0,0,0,0.08)',
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto">
              <p className="text-[#212121] text-lg leading-relaxed break-words whitespace-pre-wrap font-hidden-text">
                {note.hiddenDescription || 'No hidden description'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t-2" style={{ borderColor: '#FBC02D' }}>
              <p className="text-xs text-gray-600 italic font-date-text">Click to flip back</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}