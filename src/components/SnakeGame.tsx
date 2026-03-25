import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, 150);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-black/50 rounded-xl border-2 border-neon-blue neon-glow-blue">
      <div 
        className="grid bg-black/80 relative overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute rounded-sm ${i === 0 ? 'bg-glitch-cyan glitch-effect z-10' : 'bg-glitch-cyan/60'}`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x * 100) / GRID_SIZE}%`,
              top: `${(segment.y * 100) / GRID_SIZE}%`,
              transition: 'all 0.1s linear'
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute bg-glitch-magenta glitch-effect"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />

        {/* Overlay */}
        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-20"
            >
              {gameOver ? (
                <>
                  <h2 className="text-4xl font-bold glitch-text-magenta mb-4">SYSTEM_FAILURE</h2>
                  <p className="text-xl text-white mb-6">SCORE: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-glitch-cyan text-black font-bold hover:bg-white transition-colors glitch-effect"
                  >
                    REBOOT
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold glitch-text-cyan mb-4">PAUSED_STATE</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-glitch-magenta text-black font-bold hover:bg-white transition-colors glitch-effect"
                  >
                    RESUME_EXECUTION
                  </button>
                  <p className="mt-4 text-xs text-gray-400">PRESS SPACE TO TOGGLE</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 flex gap-4 text-xs text-gray-400 uppercase tracking-widest">
        <span>ARROWS_TO_MOVE</span>
        <span>•</span>
        <span>SPACE_TO_PAUSE</span>
      </div>
    </div>
  );
};
