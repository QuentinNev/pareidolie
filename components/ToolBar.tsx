import { CanvasContext } from "@/contexts/CanvasContext";
import Slider from "@react-native-community/slider";
import React, { useContext } from "react";
import { Button, View } from "react-native";

const colors = ["black", "red", "blue", "green", "orange", "purple"];

export default function ToolBar() {
  const { setColor, clearCanvas, undo, redo, setSize, drawMode, setDrawMode } =
    useContext(CanvasContext);

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {colors.map((c) => (
          <Button key={c} title={c} color={c} onPress={() => setColor(c)} />
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="Clear" onPress={clearCanvas} />
        <Button title="Undo" onPress={undo} />
        <Button title="Redo" onPress={redo} />
        <Slider
          style={{ width: 200 }}
          minimumValue={3}
          maximumValue={10}
          step={1}
          onValueChange={(value: number) => setSize(value)}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          title={drawMode ? "Switch to Move" : "Switch to Draw"}
          onPress={() => setDrawMode(!drawMode)}
        />
      </View>
    </View>
  );
}
