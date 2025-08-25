// app/context/CanvasContext.tsx
import React, { createContext, ReactNode, useState } from "react";

type CanvasContextType = {
  color: string;
  setColor: (color: string) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  registerClear: (fn: () => void) => void;
  registerUndoRedo: (undoFn: () => void, redoFn: () => void) => void;
};

export const CanvasContext = createContext<CanvasContextType>({
  color: "black",
  setColor: () => {},
  clearCanvas: () => {},
  undo: () => {},
  redo: () => {},
  registerClear: () => {},
  registerUndoRedo: () => {},
});

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState("black");

  let clearFn: () => void = () => {};
  let undoFn: () => void = () => {};
  let redoFn: () => void = () => {};

  const registerClear = (fn: () => void) => {
    clearFn = fn;
  };

  const registerUndoRedo = (uFn: () => void, rFn: () => void) => {
    undoFn = uFn;
    redoFn = rFn;
  };

  const clearCanvas = () => clearFn();
  const undo = () => undoFn();
  const redo = () => redoFn();

  return (
    <CanvasContext.Provider
      value={{
        color,
        setColor,
        clearCanvas,
        undo,
        redo,
        registerClear,
        registerUndoRedo,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
