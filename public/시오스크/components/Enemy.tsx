
import React from 'react';
import { type Position } from '../types';
import { ENEMY_SIZE } from '../constants';

interface EnemyProps {
  pos: Position;
}

const Enemy: React.FC<EnemyProps> = ({ pos }) => {
  return (
    <div
      className="absolute bg-white rounded-full flex items-center justify-center border-2 border-gray-400"
      style={{
        width: `${ENEMY_SIZE}px`,
        height: `${ENEMY_SIZE}px`,
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="w-1/2 h-1/2 bg-red-600 rounded-full flex items-center justify-center border-2 border-black">
        <div className="w-1/3 h-1/3 bg-black rounded-full" />
      </div>
    </div>
  );
};

export default Enemy;
