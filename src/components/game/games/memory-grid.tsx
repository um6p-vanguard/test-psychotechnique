'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Card } from '@/components/ui/card';

import { submitLevelAnswer } from '@/lib/api';

import type { BaseGameProps } from './base-game';

type CellState = 'default' | 'highlighted' | 'selected';

interface GridSettings {
  size: number;
  cellsToRemember: number;
  displayTimeMs: number;
}

export function MemoryGrid({ level, onComplete }: BaseGameProps) {
  // Extract level difficulty from the level id (e.g., 'g7-l1' -> 1)
  const levelDifficulty = parseInt(level.id.split('-l')[1]) || 1;

  // Determine grid settings based on level difficulty
  const getGridSettings = (): GridSettings => {
    switch (levelDifficulty) {
      case 1:
        return {
          size: 4, // 4x4 grid for level 1
          cellsToRemember: 3, // Easier start with 3 cells to remember
          displayTimeMs: 3000, // 3 seconds display time
        };
      case 2:
        return {
          size: 5, // 5x5 grid for level 2
          cellsToRemember: 4, // 4 cells to remember
          displayTimeMs: 2500, // 2.5 seconds display time
        };
      case 3:
        return {
          size: 6, // 6x6 grid for level 3
          cellsToRemember: 5, // 5 cells to remember
          displayTimeMs: 2000, // 2 seconds display time
        };
      case 4:
      default:
        return {
          size: 6, // 6x6 grid for level 4
          cellsToRemember: 7, // 7 cells to remember
          displayTimeMs: 1500, // 1.5 seconds display time
        };
    }
  };

  const { size: gridSize, cellsToRemember, displayTimeMs } = getGridSettings();

  // Game state
  const [gamePhase, setGamePhase] = useState<'display' | 'input'>('display');
  const [cells, setCells] = useState<CellState[]>(Array(gridSize * gridSize).fill('default'));
  const [patternToRemember, setPatternToRemember] = useState<number[]>([]);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const gameStartedRef = useRef<boolean>(false);

  // Refs for timing measurements
  const startTimeRef = useRef<number>(0);
  const responseTimes = useRef<number[]>([]);

  // Generate a random pattern when the game starts
  const generatePattern = useCallback(() => {
    const newPattern: number[] = [];
    const totalCells = gridSize * gridSize;

    while (newPattern.length < cellsToRemember) {
      const cellIndex = Math.floor(Math.random() * totalCells);
      if (!newPattern.includes(cellIndex)) {
        newPattern.push(cellIndex);
      }
    }

    return newPattern;
  }, [gridSize, cellsToRemember]);

  // Start the display phase
  const startGame = useCallback(() => {
    if (gameStartedRef.current) return;
    gameStartedRef.current = true;

    // Reset response times and start time
    responseTimes.current = [];
    startTimeRef.current = Date.now();

    const pattern = generatePattern();
    setPatternToRemember(pattern);

    // Update cells to show the pattern
    setCells((prev) => {
      const newCells = [...prev];
      pattern.forEach((idx) => {
        newCells[idx] = 'highlighted';
      });
      return newCells;
    });

    setGamePhase('display');

    // After the display time, hide the pattern and move to input phase
    setTimeout(() => {
      setCells(Array(gridSize * gridSize).fill('default'));
      setGamePhase('input');
      // Reset the start time for input phase timing
      startTimeRef.current = Date.now();
    }, displayTimeMs);
  }, [generatePattern, displayTimeMs, gridSize]);

  // Handle cell click during input phase
  const handleCellClick = useCallback(
    (index: number) => {
      if (gamePhase !== 'input') return;

      // Record the response time for this click
      const clickTime = Date.now() - startTimeRef.current;
      responseTimes.current.push(clickTime);

      // Toggle cell selection
      setSelectedCells((prev) => {
        // If already selected, remove it
        if (prev.includes(index)) {
          return prev.filter((i) => i !== index);
        }

        // If we already have enough cells selected, don't add more
        if (prev.length >= cellsToRemember) return prev;

        // Otherwise add it
        return [...prev, index];
      });

      // Update cell visual state
      setCells((prev) => {
        const newCells = [...prev];

        // If already selected, deselect it
        if (newCells[index] === 'selected') {
          newCells[index] = 'default';
        } else if (selectedCells.length < cellsToRemember) {
          // Only allow selection if we haven't reached the max yet
          newCells[index] = 'selected';
        }

        return newCells;
      });
    },
    [gamePhase, selectedCells, cellsToRemember],
  );

  // Auto-submit when the correct number of cells is selected
  useEffect(() => {
    if (gamePhase === 'input' && selectedCells.length === cellsToRemember) {
      submitHandler();
    }
  }, [selectedCells]);

  // Submit the answer
  const submitHandler = useCallback(async () => {
    if (gamePhase !== 'input' || selectedCells.length !== cellsToRemember) return;

    // Calculate total time spent on the level
    const totalTime = Date.now() - startTimeRef.current;

    // Check if all selected cells match the pattern
    const isCorrect =
      selectedCells.every((cell) => patternToRemember.includes(cell)) &&
      patternToRemember.every((cell) => selectedCells.includes(cell));

    // Calculate score (percentage of correct cells)
    const correctCells = selectedCells.filter((cell) => patternToRemember.includes(cell)).length;
    const score = Math.round((correctCells / cellsToRemember) * 100);

    // Collect analytics data to send to the backend
    const gameData = {
      // Basic metrics
      score,
      duration: totalTime,
      attempts: 1,

      // Pattern-specific data
      patternShown: patternToRemember,
      patternSelected: selectedCells,

      // Response time analytics
      responseTimes: responseTimes.current,
      averageResponseTime:
        responseTimes.current.length > 0
          ? responseTimes.current.reduce((sum, time) => sum + time, 0) /
            responseTimes.current.length
          : 0,

      // Mock student ID (in a real app, this would come from authentication)
      studentId: 'student-123',

      // Level-specific info
      levelDifficulty,
      cellsToRemember,
      gridSize,

      // Session metadata
      timestamp: new Date().toISOString(),
      success: isCorrect,
    };

    // Submit the answer data to the backend
    await submitLevelAnswer(level.id.split('-')[0], level.id, gameData);

    // Always notify parent component regardless of success
    // The parent will handle level navigation
    onComplete();
  }, [
    gamePhase,
    selectedCells,
    patternToRemember,
    cellsToRemember,
    onComplete,
    level.id,
    levelDifficulty,
    gridSize,
  ]);

  // Reset game if level changes
  useEffect(() => {
    setCells(Array(gridSize * gridSize).fill('default'));
    setSelectedCells([]);
    setPatternToRemember([]);
    setGamePhase('display');
    gameStartedRef.current = false;
    responseTimes.current = [];

    // Start the game automatically
    startGame();
  }, [level.id, gridSize, startGame]);

  return (
    <div className="flex flex-col items-center gap-4">
      {gamePhase === 'display' && (
        <div className="mb-4 text-center">
          <p className="font-medium">Remember this pattern!</p>
        </div>
      )}

      {gamePhase === 'input' && (
        <div className="mb-4 text-center">
          <p className="mb-2">
            Click on the cells you remember ({selectedCells.length}/{cellsToRemember})
          </p>
        </div>
      )}

      {/* The Grid */}
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {cells.map((state, index) => (
          <div
            key={index}
            className={`flex aspect-square cursor-pointer items-center justify-center rounded text-sm transition-colors ${
              state === 'default'
                ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                : state === 'highlighted'
                  ? 'bg-blue-500 text-white'
                  : state === 'selected'
                    ? 'bg-purple-500 text-white'
                    : ''
            }`}
            onClick={() => handleCellClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
