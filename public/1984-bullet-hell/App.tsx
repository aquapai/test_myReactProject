
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Player from './components/Player';
import Enemy from './components/Enemy';
import Bullet from './components/Bullet';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import { type GameState, type Position, type Enemy as EnemyType, type Bullet as BulletType } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SIZE,
  PLAYER_SPEED,
  ENEMY_SIZE,
  BULLET_SIZE,
  BULLET_SPEED,
  ENEMY_SPAWN_INTERVAL,
  ENEMY_FIRE_INTERVAL,
  BULLET_TEXTS
} from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [playerPos, setPlayerPos] = useState<Position>({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
  const [enemies, setEnemies] = useState<EnemyType[]>([]);
  const [bullets, setBullets] = useState<BulletType[]>([]);
  const [score, setScore] = useState<number>(0);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const animationFrameId = useRef<number>();
  const lastTime = useRef<number>(performance.now());
  const enemySpawnTimer = useRef<number>(0);
  const enemyFireTimers = useRef<Map<number, number>>(new Map());


  const resetGame = useCallback(() => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setEnemies([]);
    setBullets([]);
    setScore(0);
    keysPressed.current = {};
    enemySpawnTimer.current = 0;
    enemyFireTimers.current.clear();
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
    lastTime.current = performance.now();
  }, [resetGame]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = true;
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = false;
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = (currentTime - lastTime.current) / 1000;
    lastTime.current = currentTime;

    // Update Player Position
    setPlayerPos(prevPos => {
      let { x, y } = prevPos;
      const moveDistance = PLAYER_SPEED * deltaTime;
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) y -= moveDistance;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) y += moveDistance;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) x -= moveDistance;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) x += moveDistance;

      // Clamp position within game bounds
      x = Math.max(PLAYER_SIZE / 2, Math.min(GAME_WIDTH - PLAYER_SIZE / 2, x));
      y = Math.max(PLAYER_SIZE / 2, Math.min(GAME_HEIGHT - PLAYER_SIZE / 2, y));

      return { x, y };
    });

    // Enemy Spawning
    enemySpawnTimer.current += deltaTime * 1000;
    if (enemySpawnTimer.current > ENEMY_SPAWN_INTERVAL) {
      enemySpawnTimer.current = 0;
      setEnemies(prev => [...prev, {
        id: Date.now(),
        pos: { x: Math.random() * (GAME_WIDTH - ENEMY_SIZE) + ENEMY_SIZE / 2, y: Math.random() * (GAME_HEIGHT / 2) }
      }]);
    }
    
    // Enemy Firing
    const newBullets: BulletType[] = [];
    enemies.forEach(enemy => {
        let timer = enemyFireTimers.current.get(enemy.id) || 0;
        timer += deltaTime * 1000;
        if (timer > ENEMY_FIRE_INTERVAL) {
            timer = 0;
            const angle = Math.atan2(playerPos.y - enemy.pos.y, playerPos.x - enemy.pos.x);
            newBullets.push({
                id: Math.random(),
                pos: { ...enemy.pos },
                angle,
                text: BULLET_TEXTS[Math.floor(Math.random() * BULLET_TEXTS.length)],
            });
        }
        enemyFireTimers.current.set(enemy.id, timer);
    });

    // Update Bullets
    setBullets(prevBullets => {
        const updatedBullets = [...prevBullets, ...newBullets]
            .map(bullet => ({
                ...bullet,
                pos: {
                    x: bullet.pos.x + Math.cos(bullet.angle) * BULLET_SPEED * deltaTime,
                    y: bullet.pos.y + Math.sin(bullet.angle) * BULLET_SPEED * deltaTime,
                }
            }))
            .filter(bullet =>
                bullet.pos.x > -BULLET_SIZE && bullet.pos.x < GAME_WIDTH + BULLET_SIZE &&
                bullet.pos.y > -BULLET_SIZE && bullet.pos.y < GAME_HEIGHT + BULLET_SIZE
            );
        
        // Collision Detection
        for (const bullet of updatedBullets) {
            const dx = playerPos.x - bullet.pos.x;
            const dy = playerPos.y - bullet.pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < PLAYER_SIZE / 2 + BULLET_SIZE / 2) {
                setGameState('gameOver');
                return []; 
            }
        }
        return updatedBullets;
    });

    // Update Score
    setScore(prev => prev + deltaTime);

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [playerPos.x, playerPos.y, enemies]);

  useEffect(() => {
    if (gameState === 'playing') {
      lastTime.current = performance.now();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, gameLoop]);

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="text-center mb-2">
        <h1 className="text-4xl text-red-500">BIG BROTHER IS WATCHING</h1>
        {gameState === 'playing' && <div className="text-2xl text-green-400">SURVIVAL TIME: {score.toFixed(2)}s</div>}
      </div>
      <div
        className="relative bg-gray-900 border-2 border-gray-600 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {gameState === 'start' && <StartScreen onStart={startGame} />}
        {gameState === 'gameOver' && <GameOverScreen score={score} onRestart={startGame} />}
        
        {gameState === 'playing' && (
          <>
            <Player pos={playerPos} />
            {enemies.map(enemy => (
              <Enemy key={enemy.id} pos={enemy.pos} />
            ))}
            {bullets.map(bullet => (
              <Bullet key={bullet.id} pos={bullet.pos} text={bullet.text} />
            ))}
          </>
        )}
      </div>
    </main>
  );
};

export default App;
