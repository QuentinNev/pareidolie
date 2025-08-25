// ColorPicker.tsx
import { CanvasContext } from "@/contexts/CanvasContext";
import React, { useContext } from "react";
import { Button, ScrollView, View } from "react-native";

const colors = ["black", "red", "blue", "green", "orange", "purple"];

export default function ColorPicker() {
  const { color, setColor, clearCanvas } = useContext(CanvasContext);

  return (
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
  );
}
