import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { Button, PanResponder, ScrollView, View } from "react-native";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function App() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(4);

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

  const clearCanvas = () => setStrokes([]);

  const colors = ["black", "red", "blue", "green", "orange", "purple"];

  return (
    <View style={{ flex: 1 }}>
      {/* Wrapper fixe pour ScrollView */}
      <View style={{ height: 40 }}>
        <ScrollView
          horizontal
          contentContainerStyle={{ alignItems: "center" }}
          showsHorizontalScrollIndicator={false}
        >
          {colors.map((c) => (
            <Button key={c} title={c} color={c} onPress={() => setColor(c)} />
          ))}
          <Button title="Effacer" onPress={clearCanvas} />
        </ScrollView>
      </View>

      {/* Canvas prend le reste de l’espace */}
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
    </View>
  );
}
