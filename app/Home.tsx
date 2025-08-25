import DrawingCanvas from "@/components/DrawingCanvas";
import ToolBar from "@/components/Toolbar";
import React from "react";
import { StyleSheet, View } from "react-native";

const colors = ["black", "red", "blue", "green", "orange", "purple"];

export default function Home() {
  return (
    <View style={styles.container}>
      <ToolBar />
      <DrawingCanvas />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
