import DrawingCanvas from "@/components/DrawingCanvas";
import { SkPath } from "@shopify/react-native-skia";
import React from "react";
import { View } from "react-native";

type Stroke = { path: SkPath; color: string; strokeWidth: number };

export default function Home() {
  return (
    <View>
      <DrawingCanvas />
    </View>
  );
}
