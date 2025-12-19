
export type GameState = 'start' | 'playing' | 'gameOver';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  pos: Position;
}

export interface Enemy {
  id: number;
  pos: Position;
}

export interface Bullet {
  id: number;
  pos: Position;
  angle: number;
  text: string;
}
