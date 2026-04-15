import React, { useState, useEffect, useRef, useCallback } from "react";
import Title from "./Title";

const CarGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('carHighScore')) || 0;
  });
  const [playerLane, setPlayerLane] = useState(2); // 5 lanes: 0, 1, 2, 3, 4
  const [entities, setEntities] = useState([]);
  const [hasShield, setHasShield] = useState(false);
  
  const containerRef = useRef(null);
  const requestRef = useRef();
  const framesRef = useRef(0);
  const pointsRef = useRef(0);
  const entitiesRef = useRef([]);
  const speedRef = useRef(5);
  const shieldRef = useRef(0);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setGameOverReason("");
    setScore(0);
    setTimeLeft(30);
    setHasShield(false);
    framesRef.current = 0;
    pointsRef.current = 0;
    entitiesRef.current = [];
    setPlayerLane(2); // Center of 5 lanes
    speedRef.current = 6; // slightly faster base speed
    shieldRef.current = 0;
  };

  const backToMenu = () => {
    setGameOver(false);
    setIsPlaying(false);
  };

  const updateGame = useCallback(() => {
    if (!isPlaying) return;

    framesRef.current += 1;
    
    // Timer Logic!
    const currentTime = 30 - Math.floor(framesRef.current / 60);
    if (currentTime !== timeLeft) {
       setTimeLeft(currentTime);
    }
    
    if (currentTime <= 0) {
      setGameOverReason("TIME'S UP!");
      setGameOver(true);
      setIsPlaying(false);
      if (pointsRef.current > highScore) {
        setHighScore(pointsRef.current);
        localStorage.setItem('carHighScore', pointsRef.current);
      }
      return;
    }

    // Progressively increase speed
    if (framesRef.current > 0 && framesRef.current % 300 === 0) {
       speedRef.current += 1.2;
    }

    if (shieldRef.current > 0) {
      shieldRef.current -= 1;
      if (shieldRef.current === 0) setHasShield(false);
    }

    let currentEntities = entitiesRef.current.map(ent => ({
      ...ent,
      top: ent.top + speedRef.current
    }));

    // Random entity generation! Cars, coins, shields
    // Increase spawn rate slightly for a 30s game
    const generateChance = 0.05 + (framesRef.current * 0.00002);
    if (Math.random() < generateChance) {
      const lastEnt = currentEntities[currentEntities.length - 1];
      if (!lastEnt || lastEnt.top > 120) { // Gap between objects
        const rand = Math.random();
        let type = 'car';
        if (rand > 0.93) type = 'shield'; // 7% chance for a shield
        else if (rand > 0.65) type = 'coin'; // 28% chance for coin

        currentEntities.push({
          id: Math.random(),
          lane: Math.floor(Math.random() * 5),
          top: -80,
          type
        });
      }
    }

    // Clean up off-screen
    currentEntities = currentEntities.filter(ent => ent.top < window.innerHeight && !ent.collected);

    // Collision Detection
    const containerHeight = 500; 
    const playerTop = containerHeight - 100;
    const playerHeight = 80;
    
    let crashed = false;

    currentEntities.forEach(ent => {
      if (ent.collected) return;
      const obsHeight = ent.type === 'coin' || ent.type === 'shield' ? 40 : 80;
      const sameLane = ent.lane === playerLane;
      const overlapsY = (ent.top + obsHeight > playerTop + 15) && (ent.top + 15 < playerTop + playerHeight);
      
      if (sameLane && overlapsY) {
        if (ent.type === 'coin') {
          pointsRef.current += 20;
          setScore(pointsRef.current);
          ent.collected = true;
        } else if (ent.type === 'shield') {
          shieldRef.current = 400; // ~6.5 seconds of 60fps
          setHasShield(true);
          pointsRef.current += 50;
          setScore(pointsRef.current);
          ent.collected = true;
        } else if (ent.type === 'car') {
          if (shieldRef.current > 0) {
            // Smash the car! Mwahahaha
            ent.collected = true;
            pointsRef.current += 100; // Bonus for smashing
            setScore(pointsRef.current);
          } else {
            crashed = true;
          }
        }
      }
    });

    if (crashed) {
      setGameOverReason("CRASHED");
      setGameOver(true);
      setIsPlaying(false);
      if (pointsRef.current > highScore) {
        setHighScore(pointsRef.current);
        localStorage.setItem('carHighScore', pointsRef.current);
      }
    } else {
      currentEntities = currentEntities.filter(e => !e.collected);
      entitiesRef.current = currentEntities;
      setEntities(currentEntities);
      requestRef.current = requestAnimationFrame(updateGame);
    }
  }, [isPlaying, playerLane, highScore, timeLeft]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameOver, updateGame]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling with arrow keys inside game
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        if (isPlaying) e.preventDefault();
      }
      
      if (!isPlaying) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerLane((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerLane((prev) => Math.min(4, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const handlePointerDrag = (clientX) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const laneWidth = rect.width / 5;
    let targetLane = Math.floor(x / laneWidth);
    targetLane = Math.max(0, Math.min(4, targetLane));
    setPlayerLane(targetLane);
  };

  return (
    <section className="mb-28 px-4 md:px-16 lg:px-24 mt-0 w-full" id="arcade">
      <div className="max-w-6xl mx-auto text-center w-full">
        <Title
          title="Bored? Take A Break & Drive"
          subTitle="High-speed pursuit. Dodge traffic, collect coins, and run down the clock."
        />

        <div className="mt-12 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-12 w-full text-left">
          
          {/* Game Container - Left Side. Crucially NOT using glass-panel to protect road CSS */}
          <div 
            ref={containerRef}
            className={`relative w-full lg:w-[60%] h-[500px] bg-zinc-950 rounded-2xl border-[6px] border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 select-none touch-none ${isPlaying ? "cursor-grab active:cursor-grabbing" : ""}`}
            onPointerMove={(e) => {
              if (e.buttons === 1) handlePointerDrag(e.clientX);
            }}
            onPointerDown={(e) => handlePointerDrag(e.clientX)}
            onTouchMove={(e) => handlePointerDrag(e.touches[0].clientX)}
          >
            
            <style>
              {`
                @keyframes roadMoveDash {
                  0% { background-position: 0 0px; }
                  100% { background-position: 0 120px; }
                }
                .road-animate {
                  background-image: linear-gradient(to bottom, rgba(255,255,255,0.7) 50%, transparent 50%);
                  background-size: 8px 120px;
                  animation: roadMoveDash 0.3s linear infinite;
                }
              `}
            </style>

            {/* Asphalt Grid Lines (4 divider lines for 5 lanes) */}
            <div className={`absolute inset-0 flex justify-evenly pointer-events-none`}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-[4px] md:w-2 h-[200%] -top-[50%] road-animate ${!isPlaying ? 'opacity-20' : 'opacity-100'}`} />
              ))}
            </div>

            {/* TOP HUD: Score, Time, High Score */}
            <div className="absolute top-4 left-4 z-20 flex gap-4 w-[calc(100%-2rem)] justify-between pointer-events-none">
              <div className="flex gap-2 text-white font-black font-mono text-xl md:text-2xl tracking-widest drop-shadow-md bg-zinc-900/80 px-4 py-2 rounded-lg border border-white/10">
                 $ {score}
              </div>
              <div className={`flex gap-2 text-white font-black font-mono text-xl md:text-2xl tracking-widest drop-shadow-md bg-zinc-900/80 px-4 py-2 rounded-lg border border-white/10 transition-colors ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
                 ⏱️ {timeLeft}s
              </div>
            </div>

            {/* Shield Indicator */}
            {hasShield && (
              <div className="absolute top-20 left-4 z-20 text-cyan-400 font-bold font-mono text-lg bg-zinc-900/80 px-3 py-1 rounded-lg backdrop-blur-md border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse pointer-events-none">
                🛡️ SHIELD ACTIVE - SMASH!
              </div>
            )}

            {/* Start Screen */}
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
                <div className="bg-zinc-900 text-white px-10 py-8 rounded-2xl border border-zinc-700 shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-transform hover:scale-105">
                  <h3 className="text-3xl font-black mb-2 uppercase tracking-widest text-center text-white">Highway Racer</h3>
                  <p className="text-zinc-400 mb-6 text-center text-sm">30 Seconds. Collect Coins. Use Shields.</p>
                  <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold w-full transition shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] uppercase tracking-wide">
                    Start Engine
                  </button>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
                <div className="bg-zinc-900 text-white px-10 py-8 rounded-2xl border overflow-hidden relative shadow-[0_0_40px_rgba(0,0,0,0.8)] text-center w-[90%] max-w-sm border-zinc-700">
                  <div className={`absolute top-0 left-0 w-full h-2 ${gameOverReason === "CRASHED" ? "bg-red-500" : "bg-green-500"}`} />
                  
                  <h3 className={`text-4xl font-black mb-2 uppercase tracking-widest ${gameOverReason === "CRASHED" ? "text-red-500" : "text-green-400"}`}>
                    {gameOverReason}
                  </h3>
                  
                  <div className="bg-zinc-800 rounded-xl p-6 mb-6 mt-4 border border-zinc-700/50 shadow-inner">
                    <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm mb-1">Final Score</p>
                    <p className="text-5xl font-black text-white">{score}</p>
                    {score >= highScore && score > 0 && (
                      <p className="text-sm text-yellow-500 font-bold mt-3 animate-pulse uppercase tracking-widest">New High Score!</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button onClick={startGame} className="bg-white hover:bg-zinc-200 text-zinc-900 border border-zinc-300 px-6 py-4 rounded-full font-black w-full transition shadow-xl uppercase tracking-widest">
                      Play Again
                    </button>
                    <button onClick={backToMenu} className="bg-transparent hover:bg-white/10 text-zinc-400 px-6 py-3 rounded-full font-bold w-full transition uppercase tracking-wider text-sm">
                      Exit Game
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Player Car */}
            <div 
              className={`absolute w-12 md:w-16 h-20 md:h-24 bg-blue-600 rounded-xl transition-all duration-100 ease-out z-20 overflow-hidden border-2 ${hasShield ? 'border-cyan-300 shadow-[0_0_40px_rgba(34,211,238,1)]' : 'border-blue-400 shadow-[0_0_25px_rgba(37,99,235,0.9)]'}`}
              style={{ 
                left: `${(playerLane * 20) + 10}%`, 
                transform: 'translateX(-50%)',
                bottom: '40px' 
              }}
            >
              {/* Headlights effect if shielded */}
              {hasShield && <div className="absolute top-0 w-full h-8 bg-cyan-400/30 blur-md pointer-events-none" />}
              <div className={`absolute top-2 left-2 right-2 h-5 rounded-sm opacity-80 ${hasShield ? 'bg-cyan-200' : 'bg-blue-950'}`} />
              <div className={`absolute bottom-2 left-2 right-2 h-8 rounded-sm opacity-80 ${hasShield ? 'bg-cyan-200' : 'bg-blue-950'}`} />
            </div>

            {/* Entities (Obstacles, Coins, Shields) */}
            {entities.map((ent) => {
              if (ent.type === 'coin') {
                return (
                  <div 
                    key={ent.id}
                    className="absolute w-10 h-10 bg-yellow-400 rounded-full shadow-[0_0_25px_rgba(250,204,21,1)] border-4 border-yellow-200 z-10 flex items-center justify-center"
                    style={{ left: `${(ent.lane * 20) + 10}%`, transform: 'translateX(-50%)', top: `${ent.top}px` }}
                  >
                    <span className="font-black text-yellow-900 text-lg sm:text-xl">$</span>
                  </div>
                );
              }
              if (ent.type === 'shield') {
                return (
                  <div 
                    key={ent.id}
                    className="absolute w-12 h-12 bg-cyan-500 rounded-xl shadow-[0_0_30px_rgba(6,182,212,1)] border-4 border-cyan-100 z-10 flex items-center justify-center animate-pulse"
                    style={{ left: `${(ent.lane * 20) + 10}%`, transform: 'translateX(-50%)', top: `${ent.top}px`, rotate: '45deg' }}
                  >
                    <span className="font-black text-white text-lg" style={{rotate: '-45deg'}}>S</span>
                  </div>
                );
              }
              // It's a car
              return (
                <div 
                  key={ent.id}
                  className="absolute w-12 md:w-16 h-20 md:h-24 bg-red-600 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.9)] border-2 border-red-400 z-10 overflow-hidden"
                  style={{ left: `${(ent.lane * 20) + 10}%`, transform: 'translateX(-50%)', top: `${ent.top}px` }}
                >
                  <div className="absolute bottom-2 left-2 right-2 h-4 bg-red-950 rounded-sm opacity-80" />
                  <div className="absolute top-2 left-2 right-2 h-8 bg-red-950 rounded-sm opacity-80" />
                </div>
              );
            })}

          </div>

          {/* Text Content - Right Side */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center gap-6 mt-8 lg:mt-0">
            <h3 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
              Precision. Speed.<br/>
              <span className="font-serif italic font-light text-zinc-500 dark:text-zinc-400">Pure Control.</span>
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Experience the thrill of instantaneous response. While you explore our top-tier fleet, take a moment to test your reflexes with our custom Highway Racer.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Beat the 30-second clock, collect high-value coins, grab the smash shield, and set an undeniable All-Time High Score. 
            </p>
            
            <div className="mt-4 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-sm relative overflow-hidden shadow-sm">
               <div className="relative z-10 flex flex-col">
                 <span className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.2em] font-bold mb-1">Your All-Time Best</span>
                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                   {highScore} <span className="text-lg font-medium text-zinc-400 dark:text-zinc-500">pts</span>
                 </span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CarGame;
