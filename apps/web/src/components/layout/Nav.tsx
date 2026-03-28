import { Link, useLocation } from "react-router";
import { Moon, Sun, Accessibility, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Flex } from "@/components/layout/primitives";
import { usePreferences } from "@/hooks/usePreferences";

export function Nav() {
  const location = useLocation();
  const isGenerator = location.pathname === "/generator";
  const { dark, a11y, lowCarbon, toggleDark, toggleA11y, toggleLowCarbon } = usePreferences();

  return (
    <Flex
      as="nav"
      align="center"
      justify="between"
      aria-label="Main navigation"
      className="mx-auto max-w-6xl px-6 py-5"
    >
      <Link to="/" className="text-lg font-bold tracking-tight">
        ColorX
      </Link>

      <Flex align="center" gap="xs">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDark}
          aria-pressed={dark}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button
          variant={a11y ? "secondary" : "ghost"}
          size="icon"
          onClick={toggleA11y}
          aria-pressed={a11y}
          aria-label={a11y ? "Disable accessibility mode" : "Enable accessibility mode"}
        >
          <Accessibility className="h-4 w-4" />
        </Button>

        <Button
          variant={lowCarbon ? "secondary" : "ghost"}
          size="icon"
          onClick={toggleLowCarbon}
          aria-pressed={lowCarbon}
          aria-label={lowCarbon ? "Disable low carbon mode" : "Enable low carbon mode"}
        >
          <Leaf className="h-4 w-4" />
        </Button>

        {isGenerator ? (
          <Link to="/" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            How It Works
          </Link>
        ) : (
          <Link to="/generator" className={buttonVariants({ size: "sm" })}>
            Open Generator
          </Link>
        )}
      </Flex>
    </Flex>
  );
}
