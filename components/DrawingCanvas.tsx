// DrawingCanvas.tsx
import { CanvasContext } from "@/contexts/CanvasContext";
import {
  Canvas,
  Group,
  Path,
  Skia,
  Image as SkImage,
  SkPath,
  useImage,
} from "@shopify/react-native-skia";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function DrawingCanvas() {
  const { color, size, registerClear, registerUndoRedo, drawMode } =
    useContext(CanvasContext);

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const image = useImage(require("../assets/images/background.png"));

  // position + zoom
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  // ---- Gestures ----
  let drawing = false;

  const pan = Gesture.Pan()
    .onBegin((e) => {
      if (drawMode) {
        drawing = true;
        const path = Skia.Path.Make();
        path.moveTo((e.x - imgPos.x) / scale, (e.y - imgPos.y) / scale);
        setStrokes((prev) => [
          ...prev,
          { path, color, strokeWidth: size / scale },
        ]);
      }
    })
    .onUpdate((e) => {
      if (drawMode && drawing) {
        setStrokes((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const current = updated[updated.length - 1];
          const lx = (e.x - imgPos.x) / scale;
          const ly = (e.y - imgPos.y) / scale;
          const lastPoint = current.path.getLastPt();
          const cx = (lastPoint.x + lx) / 2;
          const cy = (lastPoint.y + ly) / 2;
          current.path.quadTo(lastPoint.x, lastPoint.y, cx, cy);
          return updated;
        });
      } else if (!drawMode) {
        setImgPos({
          x: imgPos.x + e.translationX,
          y: imgPos.y + e.translationY,
        });
      }
    })
    .onEnd(() => {
      drawing = false;
    })
    .runOnJS(true);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      if (!drawMode) {
        setScale(e.scale);
      }
    })
    .runOnJS(true);

  const gestures = Gesture.Simultaneous(pan, pinch);

  // ---- Canvas Actions ----
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
    <GestureDetector gesture={gestures}>
      <View style={{ flex: 1 }}>
        <Canvas style={{ flex: 1, backgroundColor: "white" }}>
          <Group
            transform={[
              { translateX: imgPos.x },
              { translateY: imgPos.y },
              { scale: scale },
            ]}
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
          </Group>
        </Canvas>
      </View>
    </GestureDetector>
  );
}
