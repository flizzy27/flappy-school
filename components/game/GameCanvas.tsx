"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SKIN_STYLES, type SkinId } from "@/lib/skin/constants";
import { POWERUP_CONFIG, type PowerUpType } from "@/lib/game/powerups";

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
const POWERUP_SIZE = 24;
const POWERUP_SPAWN_CHANCE = 0.28;

type GameState = "ready" | "playing" | "gameover";

interface Pipe {
  id: number;
  x: number;
  gapY: number;
  gapHeight: number;
}

interface PowerUp {
  id: number;
  type: PowerUpType;
  x: number;
  y: number;
}

export default function GameCanvas({
  onGameOver,
  skin = "default",
}: {
  onGameOver: (score: number) => void;
  skin?: SkinId;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const pipesContainerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameState>("ready");
  const [gameState, setGameState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [activeEffectLabel, setActiveEffectLabel] = useState<string | null>(null);

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

  const powerUpsRef = useRef<PowerUp[]>([]);
  const powerUpIdRef = useRef(0);
  const activeEffectRef = useRef<{ type: PowerUpType; until: number } | null>(null);
  const scoreMultiplierRef = useRef(1);

  const spawnPipe = useCallback(() => {
    const pipesPassed = scoreRef.current;
    const progress = Math.min(pipesPassed / 20, 1);
    const gapHeight = BASE_GAP - (BASE_GAP - MIN_GAP) * progress;
    const gapY =
      gapHeight / 2 +
      Math.random() * (GAME_HEIGHT - gapHeight - 80);

    const pipeId = pipeIdRef.current++;
    pipesRef.current.push({
      id: pipeId,
      x: GAME_WIDTH,
      gapY,
      gapHeight,
    });
    lastPipeXRef.current = GAME_WIDTH;

    if (Math.random() < POWERUP_SPAWN_CHANCE && gapHeight > POWERUP_SIZE + 20) {
      const types: PowerUpType[] = ["speed", "slow", "multiplier"];
      const type = types[Math.floor(Math.random() * types.length)];
      powerUpsRef.current.push({
        id: powerUpIdRef.current++,
        type,
        x: GAME_WIDTH + PIPE_WIDTH / 2 - POWERUP_SIZE / 2,
        y: gapY - POWERUP_SIZE / 2,
      });
    }
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

      const now = performance.now();
      if (activeEffectRef.current && now > activeEffectRef.current.until) {
        activeEffectRef.current = null;
        scoreMultiplierRef.current = 1;
        setActiveEffectLabel(null);
      }

      const pipesPassed = scoreRef.current;
      const progress = Math.min(pipesPassed / 30, 1);
      let baseSpeed = BASE_SPEED + (MAX_SPEED - BASE_SPEED) * progress;
      if (activeEffectRef.current) {
        baseSpeed *= POWERUP_CONFIG[activeEffectRef.current.type].speedMult;
      }
      speedRef.current = baseSpeed;

      ballVelocityRef.current += GRAVITY * dt;
      ballYRef.current += ballVelocityRef.current * dt;

      if (ballRef.current) {
        ballRef.current.style.top = `${ballYRef.current}px`;
      }

      for (const pipe of pipesRef.current) {
        pipe.x -= speedRef.current * dt;
      }
      pipesRef.current = pipesRef.current.filter((p) => p.x + PIPE_WIDTH > 0);

      for (const pu of powerUpsRef.current) {
        pu.x -= speedRef.current * dt;
      }
      powerUpsRef.current = powerUpsRef.current.filter((p) => p.x + POWERUP_SIZE > 0);

      const ballCenterX = BALL_START_X + BALL_SIZE / 2;
      const ballCenterY = ballYRef.current + BALL_SIZE / 2;
      for (const pu of powerUpsRef.current) {
        const puCenterX = pu.x + POWERUP_SIZE / 2;
        const puCenterY = pu.y + POWERUP_SIZE / 2;
        const dx = Math.abs(ballCenterX - puCenterX);
        const dy = Math.abs(ballCenterY - puCenterY);
        if (dx < (BALL_SIZE + POWERUP_SIZE) / 2 && dy < (BALL_SIZE + POWERUP_SIZE) / 2) {
          activeEffectRef.current = {
            type: pu.type,
            until: now + POWERUP_CONFIG[pu.type].duration,
          };
          scoreMultiplierRef.current = POWERUP_CONFIG[pu.type].scoreMult;
          setActiveEffectLabel(POWERUP_CONFIG[pu.type].label);
          powerUpsRef.current = powerUpsRef.current.filter((p) => p.id !== pu.id);
          break;
        }
      }

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
          scoreRef.current += scoreMultiplierRef.current;
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
        for (const pu of powerUpsRef.current) {
          const el = document.createElement("div");
          el.className = `absolute rounded-full border-2 border-white/50 ${POWERUP_CONFIG[pu.type].color}`;
          el.style.left = `${pu.x}px`;
          el.style.top = `${pu.y}px`;
          el.style.width = `${POWERUP_SIZE}px`;
          el.style.height = `${POWERUP_SIZE}px`;
          el.style.fontSize = "12px";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.textContent = pu.type === "speed" ? "⚡" : pu.type === "slow" ? "⏱" : "✭";
          container.appendChild(el);
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

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
        <span
          className="text-2xl font-bold text-white"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}
        >
          {score}
        </span>
        {activeEffectLabel && (
          <span className="text-xs font-semibold text-amber-300 bg-black/50 px-2 py-0.5 rounded">
            {activeEffectLabel}
          </span>
        )}
      </div>

      {/* Ball */}
      <div
        ref={ballRef}
        className={`absolute rounded-full shadow-lg border-2 transition-none ${SKIN_STYLES[skin]?.bg ?? SKIN_STYLES.default.bg} ${SKIN_STYLES[skin]?.border ?? SKIN_STYLES.default.border}`}
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
