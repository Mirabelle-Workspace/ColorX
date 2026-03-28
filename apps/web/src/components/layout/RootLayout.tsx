import { Outlet, useLocation } from "react-router";
import { useEffect, useRef } from "react";
import { SkipLink } from "./SkipLink";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function RootLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // Move focus to main content on route change for screen readers
    mainRef.current?.focus();
  }, [location.pathname]);

  return (
    <>
      <SkipLink />
      <Nav />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="outline-none"
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
