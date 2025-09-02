// DrawingCanvas.tsx
import { CanvasContext } from "@/contexts/CanvasContext";
import {
  Canvas,
  Path,
  Skia,
  Image as SkImage,
  SkPath,
  useImage,
} from "@shopify/react-native-skia";
import React, { useContext, useEffect, useState } from "react";
import { PanResponder, View } from "react-native";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function DrawingCanvas() {
  const { color, size, registerClear, registerUndoRedo, drawMode } =
    useContext(CanvasContext);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);

  const image = useImage(require("../assets/images/background.png")); // mets ton image ici

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => drawMode,
    onPanResponderGrant: ({ nativeEvent }) => {
      if (!drawMode) return;
      const path = Skia.Path.Make();
      path.moveTo(nativeEvent.locationX, nativeEvent.locationY);
      setStrokes((prev) => [...prev, { path, color, strokeWidth: size }]);
      setRedoStack([]);
    },
    onPanResponderMove: ({ nativeEvent }) => {
      if (!drawMode) return;
      setStrokes((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const current = updated[updated.length - 1];
        const x = nativeEvent.locationX;
        const y = nativeEvent.locationY;
        const path = current.path;
        const lastPoint = path.getLastPt();
        const cx = (lastPoint.x + x) / 2;
        const cy = (lastPoint.y + y) / 2;
        path.quadTo(lastPoint.x, lastPoint.y, cx, cy);
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
    <View style={{ flex: 1 }}>
      <Canvas
        style={{ flex: 1, backgroundColor: "white" }}
        {...panResponder.panHandlers}
      >
        {image && (
          <SkImage image={image} x={0} y={0} width={400} height={400} />
        )}
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
    </View>
  );
}
