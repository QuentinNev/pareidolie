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
import React, { useContext, useEffect, useRef, useState } from "react";
import { PanResponder, View } from "react-native";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function DrawingCanvas() {
  const { color, size, registerClear, registerUndoRedo, drawMode } =
    useContext(CanvasContext);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);

  const image = useImage(require("../assets/images/background.png"));

  // position de l’image + dessin
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: ({ nativeEvent }) => {
      if (drawMode) {
        const path = Skia.Path.Make();
        // coordonnées locales par rapport à l’offset
        path.moveTo(
          nativeEvent.locationX - imgPos.x,
          nativeEvent.locationY - imgPos.y
        );
        setStrokes((prev) => [...prev, { path, color, strokeWidth: size }]);
        setRedoStack([]);
      } else {
        lastPos.current = {
          x: nativeEvent.pageX - imgPos.x,
          y: nativeEvent.pageY - imgPos.y,
        };
      }
    },
    onPanResponderMove: ({ nativeEvent }) => {
      if (drawMode) {
        setStrokes((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const current = updated[updated.length - 1];
          const x = nativeEvent.locationX - imgPos.x;
          const y = nativeEvent.locationY - imgPos.y;
          const path = current.path;
          const lastPoint = path.getLastPt();
          const cx = (lastPoint.x + x) / 2;
          const cy = (lastPoint.y + y) / 2;
          path.quadTo(lastPoint.x, lastPoint.y, cx, cy);
          return updated;
        });
      } else {
        setImgPos({
          x: nativeEvent.pageX - lastPos.current.x,
          y: nativeEvent.pageY - lastPos.current.y,
        });
      }
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
        <Group transform={[{ translateX: imgPos.x }, { translateY: imgPos.y }]}>
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
  );
}
