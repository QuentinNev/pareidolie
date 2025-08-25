// app/context/CanvasContext.tsx
import React, { createContext, ReactNode, useState } from "react";

type CanvasContextType = {
  color: string;
  setColor: (color: string) => void;
  clearCanvas: () => void;
  registerClear: (fn: () => void) => void;
};

export const CanvasContext = createContext<CanvasContextType>({
  color: "black",
  setColor: () => {},
  clearCanvas: () => {},
  registerClear: () => {},
});

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [color, setColor] = useState("black");
  let clearFn: () => void = () => {};

  const registerClear = (fn: () => void) => {
    clearFn = fn;
  };

  const clearCanvas = () => {
    if (clearFn) clearFn();
  };

  return (
    <CanvasContext.Provider
      value={{ color, setColor, clearCanvas, registerClear }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
