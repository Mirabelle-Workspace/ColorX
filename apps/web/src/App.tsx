import { Routes, Route } from "react-router";
import { MotionConfig } from "motion/react";
import { RootLayout } from "@/components/layout/RootLayout";
import { LandingPage } from "@/pages/LandingPage";
import { GeneratorPage } from "@/pages/GeneratorPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AnnounceProvider } from "@/context/AnnounceContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { usePreferences } from "@/hooks/usePreferences";

function AppRoutes() {
  const { motionDisabled } = usePreferences();

  return (
    <MotionConfig reducedMotion={motionDisabled ? "always" : "user"}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="generator" element={<GeneratorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </MotionConfig>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AnnounceProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AnnounceProvider>
    </ErrorBoundary>
  );
}
