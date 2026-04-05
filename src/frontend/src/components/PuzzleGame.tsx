import type { GameMode } from "@/App";
import { PuzzleGrid } from "@/components/PuzzleGrid";
import type { Difficulty } from "@/data/puzzles";
import {
  allPuzzles,
  difficultyConfig,
  getPuzzle,
  getPuzzleCount,
  getUnlimitedPuzzle,
} from "@/data/puzzles";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid3x3,
  Infinity as InfinityIcon,
  Lightbulb,
  Lock,
  RotateCcw,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PuzzleGameProps {
  initialMode?: GameMode;
  initialPuzzleIndex?: number;
  onBack: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const CONFETTI_INDICES = Array.from({ length: 40 }, (_, i) => i);
const CYCLE_POSITIONS = Array.from({ length: 16 }, (_, i) => i);

function ConfettiPiece({ index }: { index: number }) {
  const colors = [
    "oklch(0.76 0.16 65)",
    "oklch(0.52 0.1 185)",
    "oklch(0.85 0.12 140)",
    "oklch(0.8 0.15 30)",
    "oklch(0.7 0.18 300)",
  ];
  const color = colors[index % colors.length];
  const left = `${(index * 7.3 + 5) % 95}%`;
  const duration = `${1.5 + (index % 8) * 0.3}s`;
  const delay = `${(index % 6) * 0.15}s`;
  const size = 8 + (index % 5) * 3;
  const isCircle = index % 3 === 0;

  return (
    <div
      className="confetti-piece"
      style={{
        position: "absolute",
        top: "-20px",
        left,
        width: size,
        height: isCircle ? size : size * 0.6,
        borderRadius: isCircle ? "50%" : "2px",
        backgroundColor: color,
        animationDuration: duration,
        animationDelay: delay,
        pointerEvents: "none",
      }}
    />
  );
}

export function PuzzleGame({
  initialMode = "easy",
  initialPuzzleIndex = 0,
  onBack,
}: PuzzleGameProps) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialMode === "unlimited" ? "easy" : (initialMode as Difficulty),
  );
  const [puzzleIndex, setPuzzleIndex] = useState(initialPuzzleIndex);
  const [unlimitedIndex, setUnlimitedIndex] = useState(0);
  const [path, setPath] = useState<[number, number][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hintCooldown, setHintCooldown] = useState(0);
  const [hintCells, setHintCells] = useState<[number, number][]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const puzzle =
    mode === "unlimited"
      ? getUnlimitedPuzzle(unlimitedIndex)
      : getPuzzle(difficulty, puzzleIndex);

  const totalCells = puzzle.gridSize * puzzle.gridSize;
  const filledCells = path.length;
  const progress = Math.round((filledCells / totalCells) * 100);
  const puzzleCount = mode === "unlimited" ? null : getPuzzleCount(difficulty);

  // Start timer on first path move
  useEffect(() => {
    if (path.length === 1 && !timerActive) {
      setTimerActive(true);
    }
  }, [path.length, timerActive]);

  // Timer tick
  useEffect(() => {
    if (timerActive && !isComplete) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isComplete]);

  // Check win condition
  useEffect(() => {
    if (path.length !== totalCells) return;

    const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
    const anchorEntries = Object.entries(puzzle.anchors).sort(
      ([, a], [, b]) => a - b,
    );

    const allAnchorsVisited = anchorEntries.every(([k]) => pathSet.has(k));

    let lastIdx = -1;
    let inOrder = true;
    for (const [k] of anchorEntries) {
      const idx = path.findIndex(([r, c]) => `${r},${c}` === k);
      if (idx <= lastIdx) {
        inOrder = false;
        break;
      }
      lastIdx = idx;
    }

    if (allAnchorsVisited && inOrder) {
      setIsComplete(true);
      setTimerActive(false);
    }
  }, [path, totalCells, puzzle]);

  const handlePathChange = useCallback(
    (newPath: [number, number][]) => {
      setPath(newPath);
      if (newPath.length > path.length) {
        setMoves((m) => m + 1);
      }
    },
    [path.length],
  );

  const clearHintCooldown = useCallback(() => {
    if (hintCooldownRef.current) {
      clearInterval(hintCooldownRef.current);
      hintCooldownRef.current = null;
    }
  }, []);

  const handleReset = useCallback(() => {
    setPath([]);
    setIsComplete(false);
    setMoves(0);
    setSeconds(0);
    setTimerActive(false);
    setHintCells([]);
    setHintCooldown(0);
    clearHintCooldown();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [clearHintCooldown]);

  const handleNewPuzzle = useCallback(
    (newMode: GameMode, newIndex: number) => {
      if (newMode === "unlimited") {
        setMode("unlimited");
        setUnlimitedIndex(0);
      } else {
        setMode(newMode);
        setDifficulty(newMode as Difficulty);
        setPuzzleIndex(newIndex);
      }
      setPath([]);
      setIsComplete(false);
      setMoves(0);
      setSeconds(0);
      setTimerActive(false);
      setHintCells([]);
      setHintCooldown(0);
      clearHintCooldown();
    },
    [clearHintCooldown],
  );

  const handleHint = useCallback(() => {
    if (hintCooldown > 0) return;

    // Find next 2 cells in solution after current path end
    let hints: [number, number][] = [];

    if (puzzle.solution && puzzle.solution.length > 0) {
      // Use solution array to find next 2 steps
      const pathSet = new Set(path.map(([r, c]) => `${r},${c}`));
      const nextCells = puzzle.solution.filter(
        ([r, c]) => !pathSet.has(`${r},${c}`),
      );
      hints = nextCells.slice(0, 2);
    } else {
      // Fall back: find next 2 unvisited anchors
      const visitedKeys = new Set(path.map(([r, c]) => `${r},${c}`));
      const anchorEntries = Object.entries(puzzle.anchors).sort(
        ([, a], [, b]) => a - b,
      );
      const unvisitedAnchors = anchorEntries
        .filter(([k]) => !visitedKeys.has(k))
        .slice(0, 2);
      hints = unvisitedAnchors.map(([k]) => {
        const [r, c] = k.split(",").map(Number);
        return [r, c] as [number, number];
      });
    }

    if (hints.length === 0) return;

    setHintCells(hints);
    setHintCooldown(30);

    // Start cooldown countdown
    clearHintCooldown();
    hintCooldownRef.current = setInterval(() => {
      setHintCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(hintCooldownRef.current!);
          hintCooldownRef.current = null;
          return 0;
        }
        // At transition from phase 1 to phase 2: clear hint cells
        if (prev === 21) {
          setHintCells([]);
        }
        return prev - 1;
      });
    }, 1000);
  }, [hintCooldown, path, puzzle, clearHintCooldown]);

  const difficultyColors: Record<Difficulty, string> = {
    easy: "oklch(0.52 0.1 185)",
    medium: "oklch(0.76 0.16 65)",
    hard: "oklch(0.62 0.18 25)",
  };

  const unlimitedColor = "oklch(0.6 0.2 290)";

  const getActiveColor = () => {
    if (mode === "unlimited") return unlimitedColor;
    return difficultyColors[difficulty];
  };

  const getDisplayLabel = () => {
    if (mode === "unlimited") return "Unlimited";
    return difficultyConfig[difficulty].label;
  };

  const getPuzzleSubLabel = () => {
    if (mode === "unlimited") {
      const posInCycle = (unlimitedIndex % 16) + 1;
      const cycleNum = Math.floor(unlimitedIndex / 16) + 1;
      const isHardPuzzle = posInCycle === 16;
      return `Puzzle #${unlimitedIndex + 1} · Cycle ${cycleNum}${
        isHardPuzzle ? " · Hard" : ""
      }`;
    }
    return `${difficultyConfig[difficulty].description} · Puzzle ${
      puzzleIndex + 1
    }/${puzzleCount}`;
  };

  const tipItems = [
    "Start at cell number 1",
    "Connect numbers in order (1→2→3…)",
    "Fill every cell in the grid",
    "No backtracking or crossing",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-header sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            data-ocid="game.back_button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            style={{ color: "oklch(0.45 0.018 220)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </button>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: "oklch(0.52 0.1 185)" }} />
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{ color: "oklch(0.52 0.1 185)" }}
            >
              ZIP PATH
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${getActiveColor()}22`,
                color: getActiveColor(),
              }}
            >
              {getDisplayLabel()}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Game card */}
        <div
          className="rounded-2xl shadow-game overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.27 0.022 210) 0%, oklch(0.31 0.028 210) 100%)",
          }}
        >
          {/* Card header */}
          <div
            className="px-6 pt-6 pb-4 border-b"
            style={{ borderColor: "oklch(1 0 0 / 8%)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1
                  className="font-display text-xl sm:text-2xl font-bold tracking-wide uppercase"
                  style={{ color: "oklch(0.94 0.01 220)" }}
                >
                  {puzzle.title}
                </h1>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "oklch(0.65 0.015 220)" }}
                >
                  {getPuzzleSubLabel()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: getActiveColor(),
                    color: "oklch(1 0 0)",
                  }}
                >
                  {getDisplayLabel().toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
              {/* Grid area */}
              <div className="w-full lg:flex-1">
                <div
                  className="mx-auto"
                  style={{
                    maxWidth:
                      puzzle.gridSize <= 5
                        ? "380px"
                        : puzzle.gridSize <= 7
                          ? "440px"
                          : "520px",
                  }}
                >
                  <PuzzleGrid
                    puzzle={puzzle}
                    path={path}
                    onPathChange={handlePathChange}
                    isComplete={isComplete}
                    hintCells={hintCells}
                  />
                </div>

                {/* Mobile quick stats */}
                <div className="flex items-center justify-center gap-6 mt-4 lg:hidden">
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.76 0.16 65)" }}
                    >
                      {filledCells}/{totalCells}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.015 220)" }}
                    >
                      Filled
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.76 0.16 65)" }}
                    >
                      {moves}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.015 220)" }}
                    >
                      Moves
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.76 0.16 65)" }}
                    >
                      {formatTime(seconds)}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.015 220)" }}
                    >
                      Time
                    </div>
                  </div>
                </div>
              </div>

              {/* Info panel */}
              <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
                {/* Stats */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "oklch(1 0 0 / 6%)" }}
                >
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    Progress
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Grid3x3
                          className="w-3 h-3"
                          style={{ color: "oklch(0.52 0.1 185)" }}
                        />
                      </div>
                      <div
                        data-ocid="game.progress_panel"
                        className="text-xl font-bold font-display"
                        style={{ color: "oklch(0.94 0.01 220)" }}
                      >
                        {progress}%
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        Filled
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap
                          className="w-3 h-3"
                          style={{ color: "oklch(0.52 0.1 185)" }}
                        />
                      </div>
                      <div
                        data-ocid="game.moves_counter"
                        className="text-xl font-bold font-display"
                        style={{ color: "oklch(0.94 0.01 220)" }}
                      >
                        {moves}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        Moves
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock
                          className="w-3 h-3"
                          style={{ color: "oklch(0.52 0.1 185)" }}
                        />
                      </div>
                      <div
                        data-ocid="game.timer"
                        className="text-xl font-bold font-display tabular-nums"
                        style={{ color: "oklch(0.94 0.01 220)" }}
                      >
                        {formatTime(seconds)}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        Time
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: "oklch(1 0 0 / 10%)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: "oklch(0.76 0.16 65)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        {filledCells} cells
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        {totalCells} total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mode selector */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "oklch(1 0 0 / 6%)" }}
                >
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    Mode
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        ["easy", "Easy"],
                        ["medium", "Med"],
                        ["hard", "Hard"],
                      ] as [Difficulty, string][]
                    ).map(([d, label]) => (
                      <button
                        type="button"
                        key={d}
                        data-ocid={`game.${d}_difficulty.tab`}
                        onClick={() => handleNewPuzzle(d, 0)}
                        className="py-1.5 text-xs font-semibold rounded-full transition-all"
                        style={{
                          backgroundColor:
                            mode === d
                              ? difficultyColors[d]
                              : "oklch(1 0 0 / 8%)",
                          color:
                            mode === d
                              ? "oklch(1 0 0)"
                              : "oklch(0.65 0.015 220)",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      data-ocid="game.unlimited.tab"
                      onClick={() => handleNewPuzzle("unlimited", 0)}
                      className="col-span-2 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5"
                      style={{
                        backgroundColor:
                          mode === "unlimited"
                            ? unlimitedColor
                            : "oklch(1 0 0 / 8%)",
                        color:
                          mode === "unlimited"
                            ? "oklch(1 0 0)"
                            : "oklch(0.65 0.015 220)",
                      }}
                    >
                      <InfinityIcon className="w-3.5 h-3.5" />
                      Unlimited
                    </button>
                  </div>
                </div>

                {/* Puzzle stepper — only for non-unlimited modes */}
                {mode !== "unlimited" && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "oklch(1 0 0 / 6%)" }}
                  >
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider mb-3"
                      style={{ color: "oklch(0.65 0.015 220)" }}
                    >
                      Puzzle
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-ocid="game.prev_puzzle.button"
                        onClick={() =>
                          handleNewPuzzle(
                            difficulty,
                            (puzzleIndex - 1 + (puzzleCount ?? 1)) %
                              (puzzleCount ?? 1),
                          )
                        }
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: "oklch(1 0 0 / 8%)",
                          color: "oklch(0.65 0.015 220)",
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center">
                        <span
                          className="text-sm font-bold font-display"
                          style={{ color: "oklch(0.94 0.01 220)" }}
                        >
                          {puzzleIndex + 1} / {puzzleCount}
                        </span>
                      </div>
                      <button
                        type="button"
                        data-ocid="game.next_puzzle.button"
                        onClick={() =>
                          handleNewPuzzle(
                            difficulty,
                            (puzzleIndex + 1) % (puzzleCount ?? 1),
                          )
                        }
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: "oklch(1 0 0 / 8%)",
                          color: "oklch(0.65 0.015 220)",
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Unlimited progress indicator */}
                {mode === "unlimited" && (
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "oklch(1 0 0 / 6%)" }}
                  >
                    <h3
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "oklch(0.65 0.015 220)" }}
                    >
                      Streak
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        data-ocid="game.unlimited_prev.button"
                        onClick={() => {
                          if (unlimitedIndex > 0) {
                            const newIdx = unlimitedIndex - 1;
                            setUnlimitedIndex(newIdx);
                            setPath([]);
                            setIsComplete(false);
                            setMoves(0);
                            setSeconds(0);
                            setTimerActive(false);
                            setHintCells([]);
                            setHintCooldown(0);
                            clearHintCooldown();
                          }
                        }}
                        disabled={unlimitedIndex === 0}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: "oklch(1 0 0 / 8%)",
                          color:
                            unlimitedIndex === 0
                              ? "oklch(0.4 0.01 220)"
                              : "oklch(0.65 0.015 220)",
                          opacity: unlimitedIndex === 0 ? 0.4 : 1,
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center">
                        <span
                          className="text-2xl font-bold font-display"
                          style={{ color: unlimitedColor }}
                        >
                          #{unlimitedIndex + 1}
                        </span>
                        <span
                          className="text-xs ml-1"
                          style={{ color: "oklch(0.65 0.015 220)" }}
                        >
                          puzzle
                        </span>
                      </div>
                      <button
                        type="button"
                        data-ocid="game.unlimited_next.button"
                        onClick={() => {
                          const newIdx = unlimitedIndex + 1;
                          setUnlimitedIndex(newIdx);
                          setPath([]);
                          setIsComplete(false);
                          setMoves(0);
                          setSeconds(0);
                          setTimerActive(false);
                          setHintCells([]);
                          setHintCooldown(0);
                          clearHintCooldown();
                        }}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          backgroundColor: "oklch(1 0 0 / 8%)",
                          color: "oklch(0.65 0.015 220)",
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Cycle mini-progress */}
                    <div className="mt-2">
                      <div className="flex gap-0.5">
                        {CYCLE_POSITIONS.map((pos) => {
                          const posInCycle = unlimitedIndex % 16;
                          const isHard = pos === 15;
                          const isDone = pos < posInCycle;
                          const isCurrent = pos === posInCycle;
                          return (
                            <div
                              key={`cp-${pos}`}
                              className="flex-1 h-1.5 rounded-full transition-all"
                              style={{
                                backgroundColor: isDone
                                  ? unlimitedColor
                                  : isCurrent
                                    ? `${unlimitedColor}88`
                                    : isHard
                                      ? "oklch(0.62 0.18 25 / 30%)"
                                      : "oklch(1 0 0 / 15%)",
                              }}
                            />
                          );
                        })}
                      </div>
                      <p
                        className="text-xs mt-1.5"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        {15 - (unlimitedIndex % 16)} until next hard
                      </p>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="game.reset.button"
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: "oklch(1 0 0 / 8%)",
                      color: "oklch(0.76 0.16 65)",
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    data-ocid="game.hint.button"
                    onClick={handleHint}
                    disabled={hintCooldown > 0}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      backgroundColor:
                        hintCooldown > 0
                          ? "oklch(1 0 0 / 5%)"
                          : hintCells.length > 0
                            ? "oklch(0.76 0.16 65 / 30%)"
                            : "oklch(1 0 0 / 8%)",
                      color:
                        hintCooldown > 0
                          ? "oklch(0.5 0.01 220)"
                          : "oklch(0.76 0.16 65)",
                      opacity: hintCooldown > 0 ? 0.65 : 1,
                      cursor: hintCooldown > 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    {hintCooldown > 0 ? (
                      hintCooldown > 20 ? (
                        <span className="tabular-nums">
                          {hintCooldown - 20}s
                        </span>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4" />
                        Hint
                      </>
                    )}
                  </button>
                </div>

                {/* How to play mini guide */}
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{ backgroundColor: "oklch(1 0 0 / 4%)" }}
                >
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    How To Play
                  </h3>
                  <ul className="space-y-1.5">
                    {tipItems.map((tip, i) => (
                      <li
                        key={tip}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        <span
                          className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: "oklch(0.52 0.1 185)",
                            color: "oklch(1 0 0)",
                          }}
                        >
                          {i + 1}
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Win overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.1 0.02 220 / 70%)" }}
            data-ocid="game.win.modal"
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {CONFETTI_INDICES.map((i) => (
                <ConfettiPiece key={i} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative rounded-2xl p-8 text-center max-w-sm mx-4 shadow-game"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.27 0.022 210) 0%, oklch(0.31 0.028 210) 100%)",
                border: "1px solid oklch(1 0 0 / 12%)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: getActiveColor() }}
              >
                <Trophy className="w-8 h-8" style={{ color: "oklch(1 0 0)" }} />
              </div>

              <h2
                className="font-display text-2xl font-bold uppercase mb-1"
                style={{ color: "oklch(0.94 0.01 220)" }}
              >
                Puzzle Complete!
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: "oklch(0.65 0.015 220)" }}
              >
                {mode === "unlimited"
                  ? `Streak: ${unlimitedIndex + 1} puzzle${unlimitedIndex + 1 === 1 ? "" : "s"} solved!`
                  : `You solved ${puzzle.title}`}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
                >
                  <div
                    className="text-lg font-bold font-display"
                    style={{ color: "oklch(0.76 0.16 65)" }}
                  >
                    {formatTime(seconds)}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    Time
                  </div>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
                >
                  <div
                    className="text-lg font-bold font-display"
                    style={{ color: "oklch(0.76 0.16 65)" }}
                  >
                    {moves}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    Moves
                  </div>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "oklch(1 0 0 / 8%)" }}
                >
                  <div
                    className="text-lg font-bold font-display"
                    style={{ color: "oklch(0.76 0.16 65)" }}
                  >
                    {getDisplayLabel()}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    Mode
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="game.win.next_puzzle.button"
                  onClick={() => {
                    if (mode === "unlimited") {
                      // Advance to next puzzle in unlimited stream
                      setUnlimitedIndex((prev) => prev + 1);
                      setPath([]);
                      setIsComplete(false);
                      setMoves(0);
                      setSeconds(0);
                      setTimerActive(false);
                      setHintCells([]);
                      setHintCooldown(0);
                      clearHintCooldown();
                    } else {
                      handleNewPuzzle(
                        difficulty,
                        (puzzleIndex + 1) % (puzzleCount ?? 1),
                      );
                    }
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: getActiveColor(),
                    color: "oklch(1 0 0)",
                  }}
                >
                  {mode === "unlimited" ? "Next →" : "Next Puzzle"}
                </button>
                <button
                  type="button"
                  data-ocid="game.win.back_home.button"
                  onClick={onBack}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: "oklch(1 0 0 / 8%)",
                    color: "oklch(0.65 0.015 220)",
                  }}
                >
                  Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
