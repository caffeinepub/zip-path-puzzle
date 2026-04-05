import type { GameMode } from "@/App";
import type { Difficulty } from "@/data/puzzles";
import { allPuzzles, difficultyConfig } from "@/data/puzzles";
import {
  ArrowRight,
  CheckSquare,
  GitBranch,
  Infinity as InfinityIcon,
  Shuffle,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface HomeScreenProps {
  onPlayPuzzle: (mode: GameMode, index: number) => void;
  onPlayUnlimited: () => void;
}

function MiniGrid({
  gridSize,
  anchors,
}: {
  gridSize: number;
  anchors: Record<string, number>;
}) {
  const previewSize = Math.min(gridSize, 5);
  const cellSize = 26;
  const gap = 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${previewSize}, ${cellSize}px)`,
        gap,
        padding: 8,
        borderRadius: 10,
        backgroundColor: "oklch(0.27 0.022 210)",
      }}
    >
      {Array.from({ length: previewSize }, (_, r) =>
        Array.from({ length: previewSize }, (_, c) => {
          const k = `${r},${c}`;
          const num = anchors[k];
          return (
            <div
              key={k}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 5,
                backgroundColor:
                  num !== undefined
                    ? "oklch(0.76 0.16 65)"
                    : "oklch(0.94 0.01 220 / 15%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                fontWeight: 700,
                color: num !== undefined ? "oklch(1 0 0)" : "transparent",
                fontFamily: "'Bricolage Grotesque', sans-serif",
              }}
            >
              {num}
            </div>
          );
        }),
      )}
    </div>
  );
}

// Infinity mini-preview using an animated grid pattern
function InfinityMiniGrid() {
  const cells = Array.from({ length: 25 }, (_, i) => i);
  const highlightCells = new Set([0, 2, 4, 6, 12, 18, 22, 24]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 26px)",
        gap: 3,
        padding: 8,
        borderRadius: 10,
        backgroundColor: "oklch(0.27 0.022 210)",
      }}
    >
      {cells.map((i) => (
        <div
          key={i}
          style={{
            width: 26,
            height: 26,
            borderRadius: 5,
            backgroundColor: highlightCells.has(i)
              ? "oklch(0.6 0.2 290)"
              : "oklch(0.94 0.01 220 / 15%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            color: highlightCells.has(i) ? "oklch(1 0 0)" : "transparent",
          }}
        >
          {highlightCells.has(i) ? "∞" : ""}
        </div>
      ))}
    </div>
  );
}

export function HomeScreen({ onPlayPuzzle, onPlayUnlimited }: HomeScreenProps) {
  const features = [
    {
      icon: Target,
      title: "Start at 1",
      desc: "Every path begins at the cell marked '1'. Find it and tap to begin your journey.",
    },
    {
      icon: GitBranch,
      title: "Sequential Order",
      desc: "Connect numbered anchors in ascending order. You must visit 1, then 2, then 3...",
    },
    {
      icon: CheckSquare,
      title: "Fill the Grid",
      desc: "Every single cell must be part of your path. No empty cells allowed!",
    },
    {
      icon: Shuffle,
      title: "No Crossings",
      desc: "Your path cannot cross or revisit itself. Plan ahead to avoid dead ends.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-header sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "oklch(0.52 0.1 185)" }}
              >
                <Zap className="w-4 h-4" style={{ color: "oklch(1 0 0)" }} />
              </div>
              <span
                className="font-display font-bold text-xl tracking-tight"
                style={{ color: "oklch(0.52 0.1 185)" }}
              >
                ZIP PATH
              </span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {["Home", "How To Play", "Puzzles"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  data-ocid={`nav.${item.toLowerCase().replace(/ /g, "_")}.link`}
                  className="text-sm font-medium transition-colors relative group"
                  style={{ color: "oklch(0.35 0.018 220)" }}
                >
                  {item}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-200"
                    style={{ backgroundColor: "oklch(0.52 0.1 185)" }}
                  />
                </a>
              ))}
            </nav>

            {/* CTA */}
            <button
              type="button"
              data-ocid="nav.play_now.button"
              onClick={() => onPlayPuzzle("easy", 0)}
              className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-md"
              style={{
                backgroundColor: "oklch(0.52 0.1 185)",
                color: "oklch(1 0 0)",
              }}
            >
              Play Now
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.49 0.11 185) 0%, oklch(0.44 0.095 185) 100%)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Left: hero text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 text-center lg:text-left"
              >
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold"
                  style={{
                    backgroundColor: "oklch(1 0 0 / 15%)",
                    color: "oklch(0.94 0.01 220)",
                  }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  The Path Puzzle Game
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  <span style={{ color: "oklch(0.76 0.16 65)" }}>ZIP</span>
                  <br />
                  <span style={{ color: "oklch(1 0 0)" }}>PATH PUZZLE</span>
                </h1>

                <p
                  className="text-base sm:text-lg mb-8 max-w-md mx-auto lg:mx-0"
                  style={{ color: "oklch(0.88 0.04 185)" }}
                >
                  Draw a continuous path through all numbers in order. Fill
                  every cell. No crossings. Pure logic.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button
                    type="button"
                    data-ocid="hero.play_now.primary_button"
                    onClick={() => onPlayPuzzle("easy", 0)}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: "oklch(0.76 0.16 65)",
                      color: "oklch(1 0 0)",
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Start Playing
                  </button>
                  <button
                    type="button"
                    data-ocid="hero.play_unlimited.button"
                    onClick={onPlayUnlimited}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: "oklch(0.6 0.2 290)",
                      color: "oklch(1 0 0)",
                    }}
                  >
                    <InfinityIcon className="w-4 h-4" />
                    Play Unlimited
                  </button>
                  <a
                    data-ocid="hero.how_to_play.button"
                    href="#how-to-play"
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:scale-105"
                    style={{
                      backgroundColor: "oklch(1 0 0 / 15%)",
                      color: "oklch(1 0 0)",
                    }}
                  >
                    How It Works
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>

              {/* Right: puzzle preview card */}
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="flex-shrink-0"
              >
                <div
                  className="rounded-2xl p-5 shadow-game"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.27 0.022 210) 0%, oklch(0.31 0.028 210) 100%)",
                    border: "1px solid oklch(1 0 0 / 12%)",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-3 flex items-center gap-2"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "oklch(0.76 0.16 65)" }}
                    />
                    Easy Puzzle Preview
                  </div>
                  <MiniGrid gridSize={5} anchors={allPuzzles.easy[0].anchors} />
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.015 220)" }}
                    >
                      5×5 grid · 5 anchors
                    </span>
                    <button
                      type="button"
                      onClick={() => onPlayPuzzle("easy", 0)}
                      className="text-xs font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
                      style={{ color: "oklch(0.76 0.16 65)" }}
                    >
                      Play <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Subtle wave divider */}
          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{
              background: "oklch(1 0 0)",
              clipPath: "ellipse(55% 100% at 50% 100%)",
            }}
          />
        </section>

        {/* Features */}
        <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              className="font-display text-3xl sm:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.23 0.022 220)" }}
            >
              The Rules
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "oklch(0.45 0.018 220)" }}
            >
              Simple to learn, challenging to master. Four principles guide your
              path.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl p-5 border"
                style={{
                  backgroundColor: "oklch(0.97 0.006 220)",
                  borderColor: "oklch(0.88 0.012 220)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "oklch(0.88 0.04 185)" }}
                >
                  <f.icon
                    className="w-5 h-5"
                    style={{ color: "oklch(0.52 0.1 185)" }}
                  />
                </div>
                <h3
                  className="font-display font-bold text-base mb-1.5"
                  style={{ color: "oklch(0.23 0.022 220)" }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.45 0.018 220)" }}
                >
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How To Play */}
        <section
          id="how-to-play"
          className="py-16 sm:py-20"
          style={{ backgroundColor: "oklch(0.97 0.006 220)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2
                className="font-display text-3xl sm:text-4xl font-bold mb-3"
                style={{ color: "oklch(0.23 0.022 220)" }}
              >
                How It Works
              </h2>
              <p
                className="text-base max-w-xl mx-auto"
                style={{ color: "oklch(0.45 0.018 220)" }}
              >
                Three steps to zip through your first puzzle
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Find the Start",
                  desc: "Locate cell number 1 on the grid. This is your starting point. Tap or click it to begin drawing your path.",
                  color: "oklch(0.52 0.1 185)",
                },
                {
                  step: "02",
                  title: "Draw the Path",
                  desc: "Drag through adjacent cells (up, down, left, right). Connect the numbered anchors in ascending order as you go.",
                  color: "oklch(0.76 0.16 65)",
                },
                {
                  step: "03",
                  title: "Fill Every Cell",
                  desc: "Your path must pass through every single cell in the grid. No gaps, no crossings. Zip it all up!",
                  color: "oklch(0.62 0.18 25)",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                  className="relative"
                >
                  {i < 2 && (
                    <div
                      className="hidden md:block absolute top-8 left-[calc(100%-16px)] w-full h-0.5 z-0"
                      style={{ backgroundColor: "oklch(0.88 0.012 220)" }}
                    />
                  )}
                  <div className="relative z-10 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-display font-bold text-xl"
                      style={{
                        backgroundColor: s.color,
                        color: "oklch(1 0 0)",
                      }}
                    >
                      {s.step}
                    </div>
                    <h3
                      className="font-display font-bold text-lg mb-2"
                      style={{ color: "oklch(0.23 0.022 220)" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.45 0.018 220)" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Puzzle chooser */}
        <section
          id="puzzles"
          className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2
              className="font-display text-3xl sm:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.23 0.022 220)" }}
            >
              Choose Your Challenge
            </h2>
            <p
              className="text-base max-w-xl mx-auto"
              style={{ color: "oklch(0.45 0.018 220)" }}
            >
              From beginner-friendly 5×5 grids to expert 9×9 challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              [
                ["easy", "Easy", "oklch(0.52 0.1 185)"],
                ["medium", "Medium", "oklch(0.76 0.16 65)"],
                ["hard", "Hard", "oklch(0.62 0.18 25)"],
              ] as [Difficulty, string, string][]
            ).map(([diff, label, accentColor], di) => {
              const cfg = difficultyConfig[diff];
              const puzzles = allPuzzles[diff];

              return (
                <motion.div
                  key={diff}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: di * 0.1 }}
                  className="rounded-2xl overflow-hidden border shadow-xs hover:shadow-md transition-shadow"
                  style={{
                    borderColor: "oklch(0.88 0.012 220)",
                    backgroundColor: "oklch(1 0 0)",
                  }}
                >
                  {/* Card header */}
                  <div
                    className="px-6 py-5"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.27 0.022 210) 0%, oklch(0.31 0.028 210) 100%)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: `${accentColor}30`,
                          color: accentColor,
                        }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.65 0.015 220)" }}
                      >
                        {puzzles.length} puzzles
                      </span>
                    </div>
                    <MiniGrid
                      gridSize={Math.min(cfg.gridSize, 5)}
                      anchors={puzzles[0].anchors}
                    />
                  </div>

                  {/* Card body */}
                  <div className="px-6 py-5">
                    <h3
                      className="font-display font-bold text-lg mb-1"
                      style={{ color: "oklch(0.23 0.022 220)" }}
                    >
                      {cfg.description.split("·")[0].trim()}
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ color: "oklch(0.45 0.018 220)" }}
                    >
                      {cfg.description.split("·")[1]?.trim()}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {puzzles.map((p, idx) => (
                        <button
                          type="button"
                          key={p.id}
                          data-ocid={`puzzles.${diff}_puzzle.item.${idx + 1}`}
                          onClick={() => onPlayPuzzle(diff, idx)}
                          className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                            border: `1px solid ${accentColor}40`,
                          }}
                        >
                          #{idx + 1} {p.title}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      data-ocid={`puzzles.${diff}_play.primary_button`}
                      onClick={() => onPlayPuzzle(diff, 0)}
                      className="w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                      style={{
                        backgroundColor: accentColor,
                        color: "oklch(1 0 0)",
                      }}
                    >
                      Play {label} →
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Unlimited card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl overflow-hidden border shadow-xs hover:shadow-md transition-shadow"
              style={{
                borderColor: "oklch(0.75 0.15 290 / 40%)",
                backgroundColor: "oklch(1 0 0)",
              }}
            >
              {/* Card header */}
              <div
                className="px-6 py-5"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.22 0.04 290) 0%, oklch(0.27 0.06 290) 100%)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "oklch(0.6 0.2 290 / 30%)",
                      color: "oklch(0.8 0.15 290)",
                    }}
                  >
                    Unlimited
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.015 220)" }}
                  >
                    ∞ puzzles
                  </span>
                </div>
                <InfinityMiniGrid />
              </div>

              {/* Card body */}
              <div className="px-6 py-5">
                <h3
                  className="font-display font-bold text-lg mb-1"
                  style={{ color: "oklch(0.23 0.022 220)" }}
                >
                  Endless Mode
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "oklch(0.45 0.018 220)" }}
                >
                  Difficulty scales every 16
                </p>

                <div className="mb-5 space-y-2">
                  {[
                    {
                      label: "Puzzles 1–15",
                      desc: "Easy & Medium alternating",
                      color: "oklch(0.52 0.1 185)",
                    },
                    {
                      label: "Puzzle 16",
                      desc: "Hard (Tier 1)",
                      color: "oklch(0.62 0.18 25)",
                    },
                    {
                      label: "Cycle 2+",
                      desc: "Harder tiers at position 16",
                      color: "oklch(0.6 0.2 290)",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.35 0.018 220)" }}
                      >
                        {item.label}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.015 220)" }}
                      >
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  data-ocid="puzzles.unlimited_play.primary_button"
                  onClick={onPlayUnlimited}
                  className="w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: "oklch(0.6 0.2 290)",
                    color: "oklch(1 0 0)",
                  }}
                >
                  <InfinityIcon className="w-4 h-4" />
                  Play Unlimited →
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="py-6 border-t text-center text-sm"
        style={{
          borderColor: "oklch(0.88 0.012 220)",
          color: "oklch(0.55 0.015 220)",
        }}
      >
        <p>
          © {new Date().getFullYear()}. Built with{" "}
          <span style={{ color: "oklch(0.62 0.18 25)" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition-colors hover:opacity-80"
            style={{ color: "oklch(0.52 0.1 185)" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
