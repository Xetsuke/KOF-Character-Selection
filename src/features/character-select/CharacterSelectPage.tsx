import { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";

import type { Character } from "../../shared/types/character";
import { CHARACTERS } from "./data/characters";
import StatBar from "./components/StatsBar";
import IntroModal from "./components/IntroModal";

export default function CharacterSelectPage() {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  // Portrait refs
  const portRefs = useRef<Array<HTMLDivElement | null>>(Array(21).fill(null));

  const [cursorRect, setCursorRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // --------- AUDIO ----------
  const [bgmStarted, setBgmStarted] = useState(false);

  const bgmRef = useRef<Howl | null>(null);
  const hoverSfxRef = useRef<Howl | null>(null);
  const confirmSfxRef = useRef<Howl | null>(null);
  const readySfxRef = useRef<Howl | null>(null);

  const lastHoverTimeRef = useRef(0);
  const lastHoverIdxRef = useRef<number | null>(null);

  const ensureBgm = () => {
    if (!bgmStarted) {
      setBgmStarted(true);
      bgmRef.current?.play();
    }
  };

  // Create background sound
  useLayoutEffect(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Howl({
        src: ["/bgm/bgm.mp3"],
        loop: true,
        volume: 0.25,
        html5: true,
        preload: true,
      });
    }
    return () => {
      bgmRef.current?.stop();
    };
  }, []);

  // ready sfx
  useLayoutEffect(() => {
    if (!readySfxRef.current) {
      readySfxRef.current = new Howl({
        src: ["/sfx/ready.mp3"],
        volume: 0.5,
      });
    }
  }, []);

  // hover sfx
  useLayoutEffect(() => {
    if (!hoverSfxRef.current) {
      hoverSfxRef.current = new Howl({
        src: ["/sfx/hoverChar.mp3"],
        volume: 0.35,
      });
    }
  }, []);

  // confirm/click sfx
  useLayoutEffect(() => {
    if (!confirmSfxRef.current) {
      confirmSfxRef.current = new Howl({
        src: ["/sfx/selectChar.mp3"],
        volume: 0.45,
      });
    }
  }, []);

  // Play hover sound when hoveredIdx changes (with cooldown)
  useLayoutEffect(() => {
    if (lastHoverIdxRef.current === null) {
      lastHoverIdxRef.current = hoveredIdx;
      return;
    }

    if (lastHoverIdxRef.current === hoveredIdx) return;
    lastHoverIdxRef.current = hoveredIdx;

    const now = Date.now();
    const cooldownMs = 90;
    if (now - lastHoverTimeRef.current < cooldownMs) return;
    lastHoverTimeRef.current = now;

    hoverSfxRef.current?.stop();
    hoverSfxRef.current?.play();
  }, [hoveredIdx]);

  // Cursor rect follows hovered portrait
  useLayoutEffect(() => {
    const node = portRefs.current[hoveredIdx];
    if (node) {
      const rect = node.getBoundingClientRect();
      const parentRect = node.parentElement!.getBoundingClientRect();
      setCursorRect({
        top: rect.top - parentRect.top,
        left: rect.left - parentRect.left,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [hoveredIdx]);

  const showingIdx = selectedIdx !== null ? selectedIdx : hoveredIdx;
  const showingChar: Character = CHARACTERS[showingIdx];

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#ffbe19_0.5px,transparent_1px)] [background-size:30px_30px]" />

      {/* Arcade-style border light glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full border-8 border-[#fdf5c2]/30 shadow-[0_0_60px_10px_rgba(255,255,180,0.08)]" />
      </div>

      <IntroModal
        open={showIntro}
        onStart={() => {
          setShowIntro(false);
          ensureBgm();
        }}
      />

      <main className="z-10 flex gap-12 w-full h-full items-center justify-center px-0 py-0">
        {/* Character Grid */}
        <div className="relative">
          <div
            className="grid grid-cols-3 grid-rows-7 gap-6 bg-black/80 p-7 rounded-2xl border-4 border-[#444] shadow-2xl"
            style={{ minWidth: 384, minHeight: 512 }}
          >
            {CHARACTERS.map((ch, idx) => (
              <div
                key={ch.id}
                ref={(el) => {
                  portRefs.current[idx] = el;
                }}
                className={`relative flex flex-col justify-end items-center overflow-hidden cursor-pointer select-none rounded-lg border-4 transition
                  ${
                    selectedIdx === idx
                      ? "border-yellow-300 shadow-xl"
                      : hoveredIdx === idx
                      ? "border-cyan-400 shadow"
                      : "border-zinc-600 shadow-none"
                  }
                  group
                `}
                style={{ aspectRatio: "1 / 1" }}
                tabIndex={0}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => {
                  ensureBgm();
                  setSelectedIdx(idx);
                  confirmSfxRef.current?.stop();
                  confirmSfxRef.current?.play();
                }}
              >
                <div className="w-full h-full bg-black">
                  <img
                    src={hoveredIdx === idx || selectedIdx === idx ? ch.color : ch.bw}
                    alt={ch.name}
                    className="w-full h-full object-cover object-[50%_40%] scale-[1.15]"
                    draggable={false}
                  />
                </div>

                {selectedIdx === idx && (
                  <motion.div
                    layoutId="lock"
                    initial={false}
                    className="absolute inset-0 pointer-events-none z-20 rounded-lg border-4 border-amber-400/70 shadow-[0_0_32px_8px_#ffe07255] animate-pulse"
                  />
                )}
              </div>
            ))}

            {/* Cursor */}
            <AnimatePresence>
              {cursorRect && selectedIdx === null && (
                <motion.div
                  key="cursor"
                  className="absolute z-30 border-4 rounded-lg pointer-events-none border-cyan-300 shadow-[0_0_24px_6px_#22d3ee33]"
                  initial={false}
                  animate={{
                    top: cursorRect.top,
                    left: cursorRect.left,
                    width: cursorRect.width,
                    height: cursorRect.height,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{ boxSizing: "border-box" }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Banner */}
          <div className="text-center mt-5">
            <motion.span
              key={selectedIdx === null ? "select" : "locked"}
              onClick={() => {
                ensureBgm();
                if (selectedIdx !== null) {
                  readySfxRef.current?.stop();
                  readySfxRef.current?.play();
                }
              }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`cursor-pointer font-extrabold text-3xl tracking-widest drop-shadow-[0_2px_10px_#FFBF27] px-6 py-1 rounded border-2 ${
                selectedIdx === null
                  ? "text-amber-300 border-yellow-500 bg-black/40"
                  : "text-lime-400 border-lime-300 bg-black/60"
              }`}
            >
              {selectedIdx === null ? "SELECT PLAYER" : "READY!"}
            </motion.span>
          </div>
        </div>

        {/* Side Panel */}
        <motion.aside
          key={showingChar.id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          className="w-80 max-w-[340px] flex flex-col bg-zinc-950/80 border-l-4 border-cyan-900 rounded-2xl px-8 py-8 shadow-2xl"
        >
          {/* Portrait grande */}
          <div className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <img
              src={showingChar.portrait}
              alt={showingChar.name}
              className="w-full h-48 object-cover select-none transform scale-[1.08]"
              draggable={false}
            />
          </div>

          <div className="flex gap-3 items-center mb-6">
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-inner border border-white/10">
              <img
                src={showingChar.color}
                alt={showingChar.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            <div className="flex-1">
              <span className="text-xs text-cyan-400 font-semibold">FIGHTER</span>
              <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow-lg">
                {showingChar.name}
              </h2>
            </div>
          </div>

          <div>
            <StatBar label="Power" value={showingChar.stats.Power} highlight={selectedIdx !== null} />
            <StatBar label="Speed" value={showingChar.stats.Speed} highlight={selectedIdx !== null} />
            <StatBar label="Technique" value={showingChar.stats.Technique} highlight={selectedIdx !== null} />
          </div>

          <div className="flex-1" />

          <AnimatePresence>
            {selectedIdx !== null && (
              <motion.div
                key="locked"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="mt-8 text-center"
              >
                <span className="text-lime-400 text-xl font-bold animate-pulse">
                  PLAYER LOCKED IN!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      </main>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
