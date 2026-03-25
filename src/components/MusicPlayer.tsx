import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "var(--color-neon-pink)"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Techno AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "var(--color-neon-blue)"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "Retrowave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "var(--color-neon-green)"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, []);

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 neon-glow-pink">
      <audio ref={audioRef} />
      
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-none flex items-center justify-center bg-black/60 border-2 border-glitch-cyan"
          style={{ boxShadow: `4px 4px 0 ${currentTrack.color}` }}
        >
          <Music className="w-8 h-8" style={{ color: currentTrack.color }} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-lg font-bold truncate text-white uppercase tracking-tight glitch-text-cyan">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400 truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Visualizer Bars */}
      <div className="flex items-end justify-between h-12 gap-1 mb-6">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 10 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 0.5 + Math.random() * 0.5,
              ease: "easeInOut"
            }}
            className="flex-1"
            style={{ backgroundColor: currentTrack.color, opacity: 0.6 + (i % 5) * 0.1 }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-1 bg-white/10 mb-6 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full"
          style={{ 
            backgroundColor: currentTrack.color,
            width: `${progress}%`,
            boxShadow: `0 0 10px ${currentTrack.color}`
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button 
          onClick={handlePrev}
          className="p-2 text-gray-400 hover:text-glitch-cyan transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center bg-glitch-cyan text-black hover:bg-white transition-transform glitch-effect"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black ml-1" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-gray-400 hover:text-glitch-cyan transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3 h-3" />
          <span>STEREO_AI_STREAM</span>
        </div>
        <span>TRACK_{currentTrackIndex + 1}_OF_{TRACKS.length}</span>
      </div>
    </div>
  );
};
