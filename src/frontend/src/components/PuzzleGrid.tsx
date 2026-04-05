import type { Puzzle } from "@/data/puzzles";
import { useCallback, useEffect, useRef, useState } from "react";

interface PuzzleGridProps {
  puzzle: Puzzle;
  path: [number, number][];
  onPathChange: (path: [number, number][]) => void;
  isComplete: boolean;
  hintCells?: [number, number][];
}

function cellKey(r: number, c: number) {
  return `${r},${c}`;
}

function isAdjacent(
  [r1, c1]: [number, number],
  [r2, c2]: [number, number],
): boolean {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

function getPathIndex(path: [number, number][], r: number, c: number): number {
  return path.findIndex(([pr, pc]) => pr === r && pc === c);
}

export function PuzzleGrid({
  puzzle,
  path,
  onPathChange,
  isComplete,
  hintCells = [],
}: PuzzleGridProps) {
  const { gridSize, anchors } = puzzle;
  const isDragging = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const hintCellSet = new Set(hintCells.map(([r, c]) => cellKey(r, c)));

  const getCellFromPoint = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const grid = gridRef.current;
      if (!grid) return null;
      const rect = grid.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cellW = rect.width / gridSize;
      const cellH = rect.height / gridSize;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        return [row, col];
      }
      return null;
    },
    [gridSize],
  );

  const handleCellEnter = useCallback(
    (r: number, c: number) => {
      if (!isDragging.current || isComplete) return;
      if (path.length === 0) return;

      const last = path[path.length - 1];
      const existingIdx = getPathIndex(path, r, c);

      if (existingIdx !== -1) {
        onPathChange(path.slice(0, existingIdx + 1));
        return;
      }

      if (!isAdjacent(last, [r, c])) return;

      const k = cellKey(r, c);
      const cellAnchor = anchors[k];
      if (cellAnchor !== undefined) {
        let maxAnchorInPath = 0;
        for (const [pr, pc] of path) {
          const a = anchors[cellKey(pr, pc)];
          if (a !== undefined && a > maxAnchorInPath) maxAnchorInPath = a;
        }
        if (cellAnchor !== maxAnchorInPath + 1) return;
      }

      onPathChange([...path, [r, c]]);
    },
    [path, onPathChange, isComplete, anchors],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault();
      if (isComplete) return;

      const k = cellKey(r, c);
      if (path.length === 0) {
        if (anchors[k] !== 1) return;
        isDragging.current = true;
        onPathChange([[r, c]]);
      } else {
        const existingIdx = getPathIndex(path, r, c);
        if (existingIdx !== -1) {
          isDragging.current = true;
          onPathChange(path.slice(0, existingIdx + 1));
        } else {
          if (anchors[k] !== 1) return;
          isDragging.current = true;
          onPathChange([[r, c]]);
        }
      }
    },
    [path, onPathChange, isComplete, anchors],
  );

  const handleMouseEnter = useCallback(
    (r: number, c: number) => {
      setHoveredCell(cellKey(r, c));
      handleCellEnter(r, c);
    },
    [handleCellEnter],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (isComplete) return;
      const touch = e.touches[0];
      const cell = getCellFromPoint(touch.clientX, touch.clientY);
      if (!cell) return;
      const [r, c] = cell;
      const k = cellKey(r, c);

      if (path.length === 0) {
        if (anchors[k] !== 1) return;
        isDragging.current = true;
        onPathChange([[r, c]]);
      } else {
        const existingIdx = getPathIndex(path, r, c);
        if (existingIdx !== -1) {
          isDragging.current = true;
          onPathChange(path.slice(0, existingIdx + 1));
        } else {
          if (anchors[k] !== 1) return;
          isDragging.current = true;
          onPathChange([[r, c]]);
        }
      }
    },
    [path, onPathChange, isComplete, anchors, getCellFromPoint],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!isDragging.current) return;
      const touch = e.touches[0];
      const cell = getCellFromPoint(touch.clientX, touch.clientY);
      if (!cell) return;
      const [r, c] = cell;
      handleCellEnter(r, c);
    },
    [getCellFromPoint, handleCellEnter],
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const pathSet = new Set(path.map(([r, c]) => cellKey(r, c)));
  const pathIndexMap = new Map(path.map(([r, c], i) => [cellKey(r, c), i]));

  const getConnections = (r: number, c: number) => {
    const idx = pathIndexMap.get(cellKey(r, c));
    if (idx === undefined)
      return { top: false, right: false, bottom: false, left: false };

    const prev = idx > 0 ? path[idx - 1] : null;
    const next = idx < path.length - 1 ? path[idx + 1] : null;

    const connects = (
      other: [number, number] | null,
      dr: number,
      dc: number,
    ) => {
      if (!other) return false;
      return other[0] === r + dr && other[1] === c + dc;
    };

    return {
      top: connects(prev, -1, 0) || connects(next, -1, 0),
      right: connects(prev, 0, 1) || connects(next, 0, 1),
      bottom: connects(prev, 1, 0) || connects(next, 1, 0),
      left: connects(prev, 0, -1) || connects(next, 0, -1),
    };
  };

  const getNextAnchorNum = () => {
    if (path.length === 0) return 1;
    let max = 0;
    for (const [r, c] of path) {
      const a = anchors[cellKey(r, c)];
      if (a !== undefined && a > max) max = a;
    }
    return max + 1;
  };
  const nextAnchor = getNextAnchorNum();

  const lineThickness = gridSize <= 5 ? 12 : gridSize <= 7 ? 10 : 8;

  return (
    <div className="relative w-full">
      <div
        ref={gridRef}
        className="no-select"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: gridSize <= 5 ? "10px" : gridSize <= 7 ? "8px" : "6px",
          touchAction: "none",
          cursor: isComplete ? "default" : "crosshair",
        }}
        onMouseLeave={() => {
          isDragging.current = false;
          setHoveredCell(null);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: gridSize }, (_, r) =>
          Array.from({ length: gridSize }, (_, c) => {
            const k = cellKey(r, c);
            const anchorNum = anchors[k];
            const inPath = pathSet.has(k);
            const pathIdx = pathIndexMap.get(k);
            const isLast = pathIdx === path.length - 1 && path.length > 0;
            const isFirst = pathIdx === 0;
            const conn = getConnections(r, c);
            const isHinted = hintCellSet.has(k);
            const isNextAnchorCell =
              anchorNum !== undefined && anchorNum === nextAnchor;
            const hovered = hoveredCell === k;

            return (
              <div
                key={k}
                data-ocid={`grid.cell.${r * gridSize + c + 1}`}
                style={{
                  aspectRatio: "1/1",
                  position: "relative",
                  borderRadius: gridSize <= 5 ? "12px" : "8px",
                  backgroundColor: inPath
                    ? "oklch(0.76 0.16 65)"
                    : isHinted
                      ? "oklch(0.85 0.18 85)"
                      : isNextAnchorCell && !inPath
                        ? "oklch(0.88 0.08 185)"
                        : hovered && !inPath && path.length > 0
                          ? "oklch(0.88 0.04 185)"
                          : "oklch(0.94 0.01 220)",
                  boxShadow: inPath
                    ? "0 2px 8px oklch(0.76 0.16 65 / 0.3)"
                    : isHinted
                      ? "0 0 12px oklch(0.85 0.18 85 / 0.7), 0 0 4px oklch(0.85 0.18 85 / 0.5)"
                      : "0 1px 3px oklch(0.23 0.022 220 / 0.12)",
                  transition:
                    "background-color 0.12s ease, box-shadow 0.12s ease, transform 0.1s ease",
                  transform: isLast && !isComplete ? "scale(1.08)" : "scale(1)",
                  zIndex: isLast ? 2 : isHinted ? 3 : 1,
                  cursor: isComplete ? "default" : "crosshair",
                  overflow: "hidden",
                  animation: isHinted
                    ? "hint-pulse 1.2s ease-in-out infinite"
                    : undefined,
                }}
                onMouseDown={(e) => handleMouseDown(e, r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                onMouseUp={handleMouseUp}
              >
                {/* Path connection lines */}
                {inPath && (
                  <>
                    {/* Center dot */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: lineThickness + 4,
                        height: lineThickness + 4,
                        borderRadius: "50%",
                        backgroundColor: "oklch(0.62 0.14 65)",
                        zIndex: 2,
                      }}
                    />
                    {/* Connection lines */}
                    {conn.top && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: lineThickness,
                          height: "50%",
                          backgroundColor: "oklch(0.62 0.14 65)",
                          zIndex: 1,
                        }}
                      />
                    )}
                    {conn.bottom && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: lineThickness,
                          height: "50%",
                          backgroundColor: "oklch(0.62 0.14 65)",
                          zIndex: 1,
                        }}
                      />
                    )}
                    {conn.left && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          transform: "translateY(-50%)",
                          width: "50%",
                          height: lineThickness,
                          backgroundColor: "oklch(0.62 0.14 65)",
                          zIndex: 1,
                        }}
                      />
                    )}
                    {conn.right && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 0,
                          transform: "translateY(-50%)",
                          width: "50%",
                          height: lineThickness,
                          backgroundColor: "oklch(0.62 0.14 65)",
                          zIndex: 1,
                        }}
                      />
                    )}
                  </>
                )}

                {/* Anchor number */}
                {anchorNum !== undefined && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 3,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 700,
                      fontSize:
                        gridSize <= 5
                          ? "1.2rem"
                          : gridSize <= 7
                            ? "1rem"
                            : "0.85rem",
                      color: inPath ? "oklch(1 0 0)" : "oklch(0.23 0.022 220)",
                      textShadow: inPath
                        ? "0 1px 2px oklch(0.62 0.14 65 / 0.5)"
                        : "none",
                      lineHeight: 1,
                    }}
                  >
                    {anchorNum}
                  </div>
                )}

                {/* First cell indicator ring */}
                {isFirst && path.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: "2px",
                      borderRadius: "inherit",
                      border: "2px solid oklch(0.62 0.14 65)",
                      zIndex: 4,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Pulse animation for start cell when path is empty */}
                {anchorNum === 1 && path.length === 0 && (
                  <div
                    className="animate-pulse-ring"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "inherit",
                      zIndex: 0,
                    }}
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
