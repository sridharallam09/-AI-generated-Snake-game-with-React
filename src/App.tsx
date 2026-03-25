import React, { useState, useCallback } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Trophy, Gamepad2, Music as MusicIcon } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore);
    setHighScore(prev => Math.max(prev, newScore));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gamepad2 className="w-8 h-8 glitch-text-cyan" />
          <h1 className="text-5xl font-black tracking-tighter uppercase italic glitch-text-cyan glitch-effect">
            NEON_SNAKE_V2
          </h1>
          <MusicIcon className="w-8 h-8 glitch-text-magenta" />
        </div>
        <p className="text-xs tracking-[0.5em] text-gray-500 font-bold uppercase">
          CYBERNETIC_RHYTHM_CORE
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="z-10 flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl w-full px-6">
        
        {/* Left Side: Stats (Desktop) / Top (Mobile) */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col gap-4 w-full lg:w-48"
        >
          <div className="bg-black/40 border-2 border-glitch-cyan p-4 flex flex-col items-center justify-center">
            <Trophy className="w-6 h-6 text-glitch-cyan mb-1" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">HIGH_SCORE</span>
            <span className="text-3xl font-black glitch-text-cyan">{highScore}</span>
          </div>

          <div className="bg-black/40 border-2 border-glitch-magenta p-4 flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">CURRENT_SCORE</span>
            <span className="text-3xl font-black glitch-text-magenta">{score}</span>
          </div>
        </motion.div>

        {/* Center: Game */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <SnakeGame onScoreChange={handleScoreChange} />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-12 text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold z-10">
        SYSTEM_CORE_V2.4.0 • POWERED_BY_SYNTH_BEATS
      </footer>

      {/* Floating Particles (Decorative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-glitch-cyan' : 'bg-glitch-magenta'}`}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>
    </div>
  );
}
