import { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Note } from '../types';
import BloodyX from './BloodyX';

interface MobileStickyStackProps {
  notes: Note[];
}

export default function MobileStickyStack({ notes }: MobileStickyStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  const dragX = useMotionValue(0);
  const rotateValue = useTransform(dragX, [-200, 0, 200], [-15, 0, 15]);
  const opacityValue = useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5]);

  if (notes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-2xl text-gray-600 font-main-text">No notes yet!</p>
      </div>
    );
  }

  const currentNote = notes[currentIndex];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isFlipped) return;

    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex(currentIndex - 1);
      } else if (info.offset.x < 0 && currentIndex < notes.length - 1) {
        setDirection(1);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const getStackedNoteStyle = (offset: number) => {
    const scale = 1 - offset * 0.05;
    const yOffset = offset * 8;
    const rotation = (offset % 2 === 0 ? 1 : -1) * Math.min(offset * 0.5, 2);

    return {
      scale,
      y: yOffset,
      rotate: rotation,
      zIndex: 10 - offset,
      opacity: 1 - offset * 0.15,
    };
  };

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center px-4 perspective-1000">
      {notes.slice(currentIndex, currentIndex + 4).map((note, idx) => {
        const isVisible = idx === 0;

        if (!isVisible) {
          return (
            <motion.div
              key={note.id}
              className="absolute w-full max-w-[320px] h-[400px]"
              style={getStackedNoteStyle(idx)}
            >
              <div
                className="w-full h-full p-6 sticky-note-shadow rounded-sm"
                style={{
                  backgroundColor: '#FFEB3B',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                  borderBottom: '2px solid rgba(0,0,0,0.08)',
                }}
              >
                <div className="tape-mark" />
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={note.id}
            className="absolute w-full max-w-[320px] h-[400px]"
            drag={!isFlipped ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
            style={{
              x: dragX,
              rotate: rotateValue,
              opacity: opacityValue,
              zIndex: 20,
            }}
            animate={{
              x: 0,
              rotate: [0, 1, -1, 0],
              transition: {
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              },
            }}
            initial={
              direction !== 0
                ? {
                    x: direction === 1 ? -300 : 300,
                    rotate: direction === 1 ? -20 : 20,
                    opacity: 0,
                  }
                : false
            }
            exit={{
              x: direction === 1 ? 300 : -300,
              rotate: direction === 1 ? 20 : -20,
              opacity: 0,
            }}
          >
            <motion.div
              className="relative w-full h-full transform-style-3d cursor-pointer"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="tape-mark" />

              {/* Front side */}
              <div
                className="absolute w-full h-full backface-hidden p-6 sticky-note-shadow rounded-sm"
                style={{
                  backgroundColor: '#FFEB3B',
                  borderRight: '1px solid rgba(0,0,0,0.05)',
                  borderBottom: '2px solid rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-auto">
                    <p className="text-[#212121] text-xl leading-relaxed break-words whitespace-pre-wrap font-main-text">
                      {note.mainText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t-2" style={{ borderColor: '#FBC02D' }}>
                    <div className="flex items-center justify-between">
                      {note.markWithX && <BloodyX />}
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
                  backgroundColor: '#FFEB3B',
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
                    <p className="text-xs text-gray-600 italic font-date-text">
                      Tap to flip back
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Navigation indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {notes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
              setIsFlipped(false);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex
                ? 'bg-yellow-600 w-6'
                : 'bg-yellow-300 hover:bg-yellow-400'
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
        <p className="text-sm font-date-text text-gray-800">
          {currentIndex + 1} / {notes.length}
        </p>
      </div>
    </div>
  );
}
