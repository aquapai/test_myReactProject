
import React from 'react';
import { type Position } from '../types';
import { PLAYER_SIZE } from '../constants';

interface PlayerProps {
  pos: Position;
}

const Player: React.FC<PlayerProps> = ({ pos }) => {
  return (
    <div
      className="bg-white absolute shadow-lg"
      style={{
        width: `${PLAYER_SIZE}px`,
        height: `${PLAYER_SIZE}px`,
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        boxShadow: '0 0 10px #fff, 0 0 20px #fff',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Player;
