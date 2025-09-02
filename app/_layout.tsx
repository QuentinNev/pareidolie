import { CanvasProvider } from "@/contexts/CanvasContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CanvasProvider>
        <Stack />
      </CanvasProvider>
    </GestureHandlerRootView>
  );
}
