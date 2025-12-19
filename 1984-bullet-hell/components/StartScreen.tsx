
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center z-10">
      <h1 className="text-8xl text-red-600" style={{ textShadow: '0 0 10px #f00' }}>1984</h1>
      <p className="text-2xl mt-4 text-gray-300">BIG BROTHER IS WATCHING YOU</p>
      <p className="text-lg mt-8 max-w-md text-gray-400">
        You are a thoughtcriminal. Survive the endless onslaught of Party-approved projectiles.
        Use Arrow Keys or WASD to move.
      </p>
      <button
        onClick={onStart}
        className="mt-8 px-8 py-4 bg-gray-200 text-black text-2xl border-2 border-gray-400 hover:bg-white hover:text-red-700 transition-all"
      >
        BEGIN TRANSMISSION
      </button>
    </div>
  );
};

export default StartScreen;
