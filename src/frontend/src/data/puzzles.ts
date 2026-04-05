export type Difficulty = "easy" | "medium" | "hard";

export interface Puzzle {
  id: string;
  title: string;
  difficulty: Difficulty;
  gridSize: number;
  anchors: Record<string, number>;
  solution?: [number, number][];
}

// Puzzles are designed so a valid Hamiltonian path exists visiting anchors in order
// and filling all cells

const easyPuzzles: Puzzle[] = [
  {
    id: "easy-1",
    title: "Morning Stroll",
    difficulty: "easy",
    gridSize: 5,
    anchors: { "0,0": 1, "0,4": 2, "2,2": 3, "4,4": 4, "4,0": 5 },
  },
  {
    id: "easy-2",
    title: "Garden Path",
    difficulty: "easy",
    gridSize: 5,
    anchors: { "0,0": 1, "2,0": 2, "2,4": 3, "4,4": 4, "4,0": 5, "0,4": 6 },
  },
  {
    id: "easy-3",
    title: "Zigzag",
    difficulty: "easy",
    gridSize: 5,
    anchors: { "0,0": 1, "0,3": 2, "1,4": 3, "3,1": 4, "4,4": 5 },
  },
  {
    id: "easy-4",
    title: "Spiral",
    difficulty: "easy",
    gridSize: 5,
    anchors: { "0,2": 1, "2,4": 2, "4,2": 3, "2,0": 4, "2,2": 5 },
  },
];

const mediumPuzzles: Puzzle[] = [
  {
    id: "medium-1",
    title: "Cross Roads",
    difficulty: "medium",
    gridSize: 7,
    anchors: {
      "0,0": 1,
      "0,6": 2,
      "2,3": 3,
      "3,6": 4,
      "4,0": 5,
      "6,3": 6,
      "6,6": 7,
    },
  },
  {
    id: "medium-2",
    title: "Winding River",
    difficulty: "medium",
    gridSize: 7,
    anchors: {
      "0,3": 1,
      "1,6": 2,
      "3,5": 3,
      "3,1": 4,
      "5,0": 5,
      "6,4": 6,
    },
  },
  {
    id: "medium-3",
    title: "City Block",
    difficulty: "medium",
    gridSize: 7,
    anchors: {
      "0,0": 1,
      "0,6": 2,
      "3,3": 3,
      "6,0": 4,
      "6,6": 5,
      "2,5": 6,
      "4,1": 7,
    },
  },
];

const hardPuzzles: Puzzle[] = [
  {
    id: "hard-1",
    title: "The Labyrinth",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,8": 2,
      "2,4": 3,
      "4,8": 4,
      "4,4": 5,
      "4,0": 6,
      "6,4": 7,
      "8,0": 8,
      "8,8": 9,
    },
  },
  {
    id: "hard-2",
    title: "Grand Tour",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,4": 1,
      "2,0": 2,
      "2,8": 3,
      "4,4": 4,
      "6,0": 5,
      "6,8": 6,
      "8,4": 7,
      "1,2": 8,
      "7,6": 9,
    },
  },
  {
    id: "hard-3",
    title: "Master Path",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,8": 2,
      "2,2": 3,
      "2,6": 4,
      "4,4": 5,
      "6,2": 6,
      "6,6": 7,
      "8,0": 8,
      "8,8": 9,
    },
  },
];

export const hardTier2Puzzles: Puzzle[] = [
  {
    id: "hard-t2-1",
    title: "The Labyrinth II",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,4": 2,
      "0,8": 3,
      "2,2": 4,
      "2,6": 5,
      "4,0": 6,
      "4,4": 7,
      "4,8": 8,
      "6,2": 9,
      "6,6": 10,
      "8,0": 11,
      "8,4": 12,
      "8,8": 13,
    },
  },
  {
    id: "hard-t2-2",
    title: "Web of Steel",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,1": 1,
      "0,7": 2,
      "1,4": 3,
      "3,0": 4,
      "3,8": 5,
      "4,4": 6,
      "5,0": 7,
      "5,8": 8,
      "7,4": 9,
      "8,1": 10,
      "8,7": 11,
    },
  },
  {
    id: "hard-t2-3",
    title: "Nexus",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,8": 2,
      "1,4": 3,
      "3,2": 4,
      "3,6": 5,
      "4,0": 6,
      "4,8": 7,
      "5,4": 8,
      "7,2": 9,
      "7,6": 10,
      "8,0": 11,
      "8,8": 12,
    },
  },
];

export const hardTier3Puzzles: Puzzle[] = [
  {
    id: "hard-t3-1",
    title: "The Ultimate",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,3": 2,
      "0,6": 3,
      "1,8": 4,
      "3,0": 5,
      "3,3": 6,
      "3,6": 7,
      "4,8": 8,
      "5,0": 9,
      "5,3": 10,
      "5,6": 11,
      "6,8": 12,
      "8,0": 13,
      "8,3": 14,
      "8,8": 15,
    },
  },
  {
    id: "hard-t3-2",
    title: "Cosmos",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,4": 2,
      "0,8": 3,
      "2,2": 4,
      "2,4": 5,
      "2,6": 6,
      "4,0": 7,
      "4,4": 8,
      "4,8": 9,
      "6,2": 10,
      "6,4": 11,
      "6,6": 12,
      "8,0": 13,
      "8,4": 14,
      "8,8": 15,
    },
  },
  {
    id: "hard-t3-3",
    title: "Infinity Grid",
    difficulty: "hard",
    gridSize: 9,
    anchors: {
      "0,0": 1,
      "0,2": 2,
      "0,6": 3,
      "0,8": 4,
      "2,4": 5,
      "4,0": 6,
      "4,4": 7,
      "4,8": 8,
      "6,4": 9,
      "8,0": 10,
      "8,2": 11,
      "8,6": 12,
      "8,8": 13,
    },
  },
];

export const allPuzzles: Record<Difficulty, Puzzle[]> = {
  easy: easyPuzzles,
  medium: mediumPuzzles,
  hard: hardPuzzles,
};

export function getPuzzle(difficulty: Difficulty, index: number): Puzzle {
  const puzzles = allPuzzles[difficulty];
  return puzzles[index % puzzles.length];
}

export function getPuzzleCount(difficulty: Difficulty): number {
  return allPuzzles[difficulty].length;
}

export const difficultyConfig: Record<
  Difficulty,
  { label: string; gridSize: number; color: string; description: string }
> = {
  easy: {
    label: "Easy",
    gridSize: 5,
    color: "teal",
    description: "5×5 grid · Perfect for beginners",
  },
  medium: {
    label: "Medium",
    gridSize: 7,
    color: "orange",
    description: "7×7 grid · Requires planning",
  },
  hard: {
    label: "Hard",
    gridSize: 9,
    color: "red",
    description: "9×9 grid · Expert challenge",
  },
};

// Returns which hard tier to use based on which cycle we're in (0-indexed cycle)
// Cycle 0 = positions 1-16, cycle 1 = positions 17-32, etc.
// tier increases each cycle: cycle 0 → tier1, cycle 1 → tier2, cycle 2+ → tier3
export function getUnlimitedPuzzle(sequenceIndex: number): Puzzle {
  // sequenceIndex is 0-based (puzzle #1 = index 0)
  const cycleLength = 16;
  const posInCycle = sequenceIndex % cycleLength; // 0..15
  const cycleNumber = Math.floor(sequenceIndex / cycleLength); // 0, 1, 2...

  if (posInCycle === 15) {
    // Position 16 of each cycle — pick hard tier based on cycle
    if (cycleNumber === 0) {
      return hardPuzzles[cycleNumber % hardPuzzles.length];
    }
    if (cycleNumber === 1) {
      return hardTier2Puzzles[(cycleNumber - 1) % hardTier2Puzzles.length];
    }
    return hardTier3Puzzles[(cycleNumber - 2) % hardTier3Puzzles.length];
  }

  // Positions 1-15: alternate easy (even posInCycle) / medium (odd posInCycle)
  if (posInCycle % 2 === 0) {
    return easyPuzzles[posInCycle % easyPuzzles.length];
  }
  return mediumPuzzles[posInCycle % mediumPuzzles.length];
}
