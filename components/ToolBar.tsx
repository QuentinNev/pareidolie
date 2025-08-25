import { CanvasContext } from "@/contexts/CanvasContext";
import Slider from "@react-native-community/slider";
import React, { useContext } from "react";
import { Button, ScrollView, View } from "react-native";

const colors = ["black", "red", "blue", "green", "orange", "purple"];

export default function ToolBar() {
  const { setColor, clearCanvas, undo, redo, setSize } =
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
      <View style={{ paddingHorizontal: 10 }}>
        <Slider
          minimumValue={3}
          maximumValue={10}
          step={1}
          onValueChange={(value: number) => setSize(value)}
        />
      </View>
    </View>
  );
}
