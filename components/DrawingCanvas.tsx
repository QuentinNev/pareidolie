// DrawingCanvas.tsx
import { CanvasContext } from "@/contexts/CanvasContext";
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import React, { useContext, useEffect, useState } from "react";
import { PanResponder } from "react-native";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function DrawingCanvas() {
  const { color, registerClear, registerUndoRedo } = useContext(CanvasContext);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const strokeWidth = 4;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: ({ nativeEvent }) => {
      const path = Skia.Path.Make();
      path.moveTo(nativeEvent.locationX, nativeEvent.locationY);
      setStrokes((prev) => [...prev, { path, color, strokeWidth }]);
      setRedoStack([]); // efface la pile redo dès qu’on dessine
    },
    onPanResponderMove: ({ nativeEvent }) => {
      setStrokes((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        updated[updated.length - 1].path.lineTo(
          nativeEvent.locationX,
          nativeEvent.locationY
        );
        return updated;
      });
    },
  });

  const clear = () => {
    setStrokes([]);
    setRedoStack([]);
  };

  const undo = () => {
    setStrokes((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setRedoStack((rs) => [last, ...rs]);
      return prev.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const [first, ...rest] = prev;
      setStrokes((s) => [...s, first]);
      return rest;
    });
  };

  useEffect(() => {
    registerClear(clear);
    registerUndoRedo(undo, redo);
  }, [strokes, redoStack]);

  return (
    <Canvas
      style={{ flex: 1, backgroundColor: "white" }}
      {...panResponder.panHandlers}
    >
      {strokes.map((s, i) => (
        <Path
          key={i}
          path={s.path}
          color={s.color}
          style="stroke"
          strokeWidth={s.strokeWidth}
        />
      ))}
    </Canvas>
  );
}
