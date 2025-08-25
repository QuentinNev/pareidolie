// DrawingCanvas.tsx
import { CanvasContext } from "@/contexts/CanvasContext";
import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import React, { useContext, useEffect, useState } from "react";
import { PanResponder } from "react-native";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function DrawingCanvas() {
  const { color, registerClear } = useContext(CanvasContext);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokeWidth = 4;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: ({ nativeEvent }) => {
      const path = Skia.Path.Make();
      path.moveTo(nativeEvent.locationX, nativeEvent.locationY);
      setStrokes([...strokes, { path, color, strokeWidth }]);
    },
    onPanResponderMove: ({ nativeEvent }) => {
      const updated = [...strokes];
      updated[updated.length - 1].path.lineTo(
        nativeEvent.locationX,
        nativeEvent.locationY
      );
      setStrokes(updated);
    },
  });

  useEffect(() => {
    registerClear(() => setStrokes([]));
  }, [strokes]);

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
