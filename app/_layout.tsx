import { CanvasProvider } from "@/contexts/CanvasContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <CanvasProvider>
      <Stack />
    </CanvasProvider>
  );
}
