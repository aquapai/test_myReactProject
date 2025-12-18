
import React from 'react';
import { type Position } from '../types';
import { BULLET_SIZE } from '../constants';

interface BulletProps {
  pos: Position;
  text: string;
}

const Bullet: React.FC<BulletProps> = ({ pos, text }) => {
  return (
    <div
      className="absolute text-red-500 font-bold flex items-center justify-center text-xs"
      style={{
        width: `auto`,
        height: `${BULLET_SIZE}px`,
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        textShadow: '0 0 5px #f00, 0 0 10px #f00',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export default Bullet;
