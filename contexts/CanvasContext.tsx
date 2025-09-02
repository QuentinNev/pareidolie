// app/context/CanvasContext.tsx
import React, { createContext, ReactNode, useState } from "react";
// CanvasContext.tsx
type CanvasContextType = {
  color: string;
  setColor: (color: string) => void;
  size: number;
  setSize: (size: number) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  registerClear: (fn: () => void) => void;
  registerUndoRedo: (undoFn: () => void, redoFn: () => void) => void;
  drawMode: boolean;
  setDrawMode: (v: boolean) => void;
};

export const CanvasContext = createContext<CanvasContextType>({
  color: "black",
  setColor: () => {},
  size: 0.1,
  setSize: () => {},
  clearCanvas: () => {},
  undo: () => {},
  redo: () => {},
  registerClear: () => {},
  registerUndoRedo: () => {},
  drawMode: true,
  setDrawMode: () => {},
});

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState("black");
  const [size, setSize] = useState(0.1);
  const [drawMode, setDrawMode] = useState(true);

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
        size,
        setSize,
        clearCanvas,
        undo,
        redo,
        registerClear,
        registerUndoRedo,
        drawMode,
        setDrawMode,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
