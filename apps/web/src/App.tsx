import { Routes, Route } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { LandingPage } from "@/pages/LandingPage";
import { GeneratorPage } from "@/pages/GeneratorPage";
import { AnnounceProvider } from "@/context/AnnounceContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function App() {
  return (
    <AnnounceProvider>
      <ThemeProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="generator" element={<GeneratorPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </AnnounceProvider>
  );
}
