import { Canvas, Path, Skia, SkPath } from "@shopify/react-native-skia";
import React, { useState } from "react";
import { PanResponder, View } from "react-native";

export default function App() {
  const [paths, setPaths] = useState<SkPath[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: ({ nativeEvent }) => {
      const newPath = Skia.Path.Make();
      newPath.moveTo(nativeEvent.locationX, nativeEvent.locationY);
      setPaths([...paths, newPath]);
    },
    onPanResponderMove: ({ nativeEvent }) => {
      const updatedPaths = [...paths];
      updatedPaths[updatedPaths.length - 1].lineTo(
        nativeEvent.locationX,
        nativeEvent.locationY
      );
      setPaths(updatedPaths);
    },
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Canvas style={{ flex: 1 }}>
        {paths.map((p, i) => (
          <Path key={i} path={p} color="black" style="stroke" strokeWidth={4} />
        ))}
      </Canvas>
    </View>
  );
}
