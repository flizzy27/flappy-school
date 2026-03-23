"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BALL_SIZE = 32;
const BALL_START_X = 80;
const PIPE_WIDTH = 60;
const BASE_GAP = 200;
const MIN_GAP = 120;
const GRAVITY = 0.4;
const JUMP_STRENGTH = -8;
const BASE_SPEED = 2.5;
const MAX_SPEED = 5;

type GameState = "ready" | "playing" | "gameover";

interface Pipe {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
}

export default function GameCanvas({
  onGameOver,
}: {
  onGameOver: (score: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const pipesContainerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>("ready");
  const [gameState, setGameState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);

  const ballYRef = useRef(GAME_HEIGHT / 2 - BALL_SIZE / 2);
  const ballVelocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const pipeIdRef = useRef(0);
  const scoreRef = useRef(0);
  const lastPipeXRef = useRef(GAME_WIDTH + 100);
  const passedPipesRef = useRef<Set<number>>(new Set());
  const speedRef = useRef(BASE_SPEED);
  const frameRef = useRef<number>(0);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const spawnPipe = useCallback(() => {
    const pipesPassed = scoreRef.current;
    const progress = Math.min(pipesPassed / 20, 1);
    const gapHeight = BASE_GAP - (BASE_GAP - MIN_GAP) * progress;
    const gapY =
      gapHeight / 2 +
      Math.random() * (GAME_HEIGHT - gapHeight - 80);

    pipesRef.current.push({
      id: pipeIdRef.current++,
      x: GAME_WIDTH,
      gapY,
      gapHeight,
    });
    lastPipeXRef.current = GAME_WIDTH;
  }, []);

  const checkCollision = useCallback(
    (ballX: number, ballY: number, ballSize: number): boolean => {
      if (ballY < 0 || ballY + ballSize > GAME_HEIGHT) return true;

      const ballCenterX = ballX + ballSize / 2;
      const ballCenterY = ballY + ballSize / 2;

      for (const pipe of pipesRef.current) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        if (ballCenterX + ballSize / 2 < pipeLeft || ballCenterX - ballSize / 2 > pipeRight)
          continue;

        const topPipeBottom = pipe.gapY - pipe.gapHeight / 2;
        const bottomPipeTop = pipe.gapY + pipe.gapHeight / 2;

        if (ballCenterY - ballSize / 2 < topPipeBottom) return true;
        if (ballCenterY + ballSize / 2 > bottomPipeTop) return true;
      }
      return false;
    },
    []
  );

  const jump = useCallback(() => {
    if (gameStateRef.current === "ready") {
      gameStateRef.current = "playing";
      setGameState("playing");
      ballVelocityRef.current = JUMP_STRENGTH;
      spawnPipe();
    } else if (gameStateRef.current === "playing") {
      ballVelocityRef.current = JUMP_STRENGTH;
    }
  }, [spawnPipe]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  useEffect(() => {
    let lastTime = 0;

    const gameLoop = (time: number) => {
      frameRef.current = requestAnimationFrame(gameLoop);
      const dt = Math.min((time - lastTime) / 16, 3);
      lastTime = time;

      if (gameStateRef.current !== "playing") return;

      const pipesPassed = scoreRef.current;
      const progress = Math.min(pipesPassed / 30, 1);
      speedRef.current = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * progress;

      ballVelocityRef.current += GRAVITY * dt;
      ballYRef.current += ballVelocityRef.current * dt;

      if (ballRef.current) {
        ballRef.current.style.top = `${ballYRef.current}px`;
      }

      for (const pipe of pipesRef.current) {
        pipe.x -= speedRef.current * dt;
      }
      pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_WIDTH > 0);

      const lastPipe = pipesRef.current[pipesRef.current.length - 1];
      if (!lastPipe || lastPipeXRef.current - lastPipe.x > 220) {
        spawnPipe();
      }

      for (const pipe of pipesRef.current) {
        if (
          pipe.x + PIPE_WIDTH < BALL_START_X &&
          !passedPipesRef.current.has(pipe.id)
        ) {
          passedPipesRef.current.add(pipe.id);
          scoreRef.current += 1;
          setScore(scoreRef.current);
        }
      }

      const collided = checkCollision(
        BALL_START_X,
        ballYRef.current,
        BALL_SIZE
      );
      if (collided) {
        gameStateRef.current = "gameover";
        setGameState("gameover");
        onGameOverRef.current(scoreRef.current);
        cancelAnimationFrame(frameRef.current);
        return;
      }

      const container = pipesContainerRef.current;
      if (container) {
        container.innerHTML = "";
        for (const pipe of pipesRef.current) {
          const topPipe = document.createElement("div");
          topPipe.className = "absolute bg-emerald-600 border-2 border-emerald-500 rounded-b";
          topPipe.style.left = `${pipe.x}px`;
          topPipe.style.top = "0";
          topPipe.style.width = `${PIPE_WIDTH}px`;
          topPipe.style.height = `${pipe.gapY - pipe.gapHeight / 2}px`;

          const bottomPipe = document.createElement("div");
          bottomPipe.className = "absolute bg-emerald-600 border-2 border-emerald-500 rounded-t";
          bottomPipe.style.left = `${pipe.x}px`;
          bottomPipe.style.top = `${pipe.gapY + pipe.gapHeight / 2}px`;
          bottomPipe.style.width = `${PIPE_WIDTH}px`;
          bottomPipe.style.height = `${GAME_HEIGHT - (pipe.gapY + pipe.gapHeight / 2)}px`;

          container.appendChild(topPipe);
          container.appendChild(bottomPipe);
        }
      }
    };

    frameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [checkCollision, spawnPipe]);

  const handleClick = useCallback(() => {
    jump();
  }, [jump]);

  const initialBallY = GAME_HEIGHT / 2 - BALL_SIZE / 2;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative overflow-hidden rounded-xl border-2 border-slate-600 bg-slate-900 cursor-pointer select-none"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.code === "Space" && e.preventDefault()}
    >
      {gameState === "ready" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/80">
          <p className="text-cyan-400 font-semibold">Tap or Space to start</p>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/90">
          <p className="text-red-400 font-bold text-lg">Game Over</p>
        </div>
      )}

      <div
        className="absolute text-2xl font-bold text-white z-10 top-4 left-1/2 -translate-x-1/2"
        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
      >
        {score}
      </div>

      {/* Ball */}
      <div
        ref={ballRef}
        className="absolute rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg border-2 border-cyan-300 transition-none"
        style={{
          left: BALL_START_X,
          top: initialBallY,
          width: BALL_SIZE,
          height: BALL_SIZE,
        }}
      />

      {/* Pipes container - imperative DOM updates */}
      <div
        ref={pipesContainerRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
