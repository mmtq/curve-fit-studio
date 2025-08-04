'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Points = [number, number][];

interface InputPointsContextType {
  points: Points;
  setPoints: React.Dispatch<React.SetStateAction<Points>>;
}

const InputPointsContext = createContext<InputPointsContextType | undefined>(undefined);

export function InputPointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState<Points>([
    [1, 2],
    [2, 5],
    [3, 10],
  ]); // initial points


  return (
    <InputPointsContext.Provider value={{ points, setPoints }}>
      {children}
    </InputPointsContext.Provider>
  );
}

// Custom hook for easier usage
export function useInputPoints() {
  const context = useContext(InputPointsContext);
  if (!context) {
    throw new Error('useInputPoints must be used within an InputPointsProvider');
  }
  return context;
}
