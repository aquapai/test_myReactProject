
import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center z-10">
      <h1 className="text-6xl text-red-600" style={{ textShadow: '0 0 10px #f00' }}>TRANSMISSION ENDED</h1>
      <p className="text-2xl mt-4 text-gray-300">You have been vaporized.</p>
      <p className="text-3xl mt-8 text-white">
        Survival Time: <span className="text-green-400">{score.toFixed(2)}s</span>
      </p>
      <button
        onClick={onRestart}
        className="mt-8 px-8 py-4 bg-gray-200 text-black text-2xl border-2 border-gray-400 hover:bg-white hover:text-red-700 transition-all"
      >
        RE-EDUCATE
      </button>
    </div>
  );
};

export default GameOverScreen;
