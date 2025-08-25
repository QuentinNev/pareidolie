import { CanvasContext } from "@/contexts/CanvasContext";
import React, { useContext } from "react";
import { Button, ScrollView, View } from "react-native";

const colors = ["black", "red", "blue", "green", "orange", "purple"];

export default function ToolBar() {
  const { color, setColor, clearCanvas, undo, redo } =
    useContext(CanvasContext);

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{ alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
      >
        {colors.map((c) => (
          <Button key={c} title={c} color={c} onPress={() => setColor(c)} />
        ))}
      </ScrollView>
      <ScrollView horizontal>
        <Button title="Clear" onPress={clearCanvas} />
        <Button title="Undo" onPress={undo} />
        <Button title="Redo" onPress={redo} />
      </ScrollView>
    </View>
  );
}
