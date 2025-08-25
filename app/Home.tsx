import ColorPicker from "@/components/ColorPicker";
import DrawingCanvas from "@/components/DrawingCanvas";
import React from "react";
import { StyleSheet, View } from "react-native";

const colors = ["black", "red", "blue", "green", "orange", "purple"];

export default function Home() {
  return (
    <View style={styles.container}>
      <ColorPicker />
      <DrawingCanvas />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
