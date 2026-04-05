import { HomeScreen } from "@/components/HomeScreen";
import { PuzzleGame } from "@/components/PuzzleGame";
import type { Difficulty } from "@/data/puzzles";
import { useState } from "react";

type Screen = "home" | "game";

export type GameMode = Difficulty | "unlimited";

interface GameConfig {
  mode: GameMode;
  puzzleIndex: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: "easy",
    puzzleIndex: 0,
  });

  const handlePlayPuzzle = (mode: GameMode, puzzleIndex: number) => {
    setGameConfig({ mode, puzzleIndex });
    setScreen("game");
  };

  const handlePlayUnlimited = () => {
    setGameConfig({ mode: "unlimited", puzzleIndex: 0 });
    setScreen("game");
  };

  const handleBack = () => {
    setScreen("home");
  };

  if (screen === "game") {
    return (
      <PuzzleGame
        initialMode={gameConfig.mode}
        initialPuzzleIndex={gameConfig.puzzleIndex}
        onBack={handleBack}
      />
    );
  }

  return (
    <HomeScreen
      onPlayPuzzle={handlePlayPuzzle}
      onPlayUnlimited={handlePlayUnlimited}
    />
  );
}
