export default function BloodyX() {
  return (
    <div className="relative w-[25px] h-[25px] border-2 border-[#b71c1c] rounded-sm bg-white/80 bloody-x-animate">
      <svg
        viewBox="0 0 25 25"
        className="absolute inset-0"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(139, 0, 0, 0.5))' }}
      >
        <defs>
          <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0000" />
            <stop offset="50%" stopColor="#8b0000" />
            <stop offset="100%" stopColor="#4a0000" />
          </linearGradient>
          <filter id="bloodSmudge">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
          </filter>
        </defs>

        {/* X Mark */}
        <path
          d="M 6 6 L 19 19 M 19 6 L 6 19"
          stroke="url(#bloodGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#bloodSmudge)"
        />

        {/* Drip effect */}
        <ellipse
          cx="12.5"
          cy="21"
          rx="2"
          ry="3"
          fill="url(#bloodGradient)"
          opacity="0.8"
          filter="url(#bloodSmudge)"
        />

        {/* Small drip */}
        <ellipse
          cx="12.5"
          cy="24"
          rx="1"
          ry="1.5"
          fill="#4a0000"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
