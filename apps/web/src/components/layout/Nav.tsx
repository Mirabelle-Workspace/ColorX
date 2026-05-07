import { Link } from "react-router";
import { Moon, Sun, Accessibility, Leaf, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Flex } from "@/components/layout/primitives";
import { usePreferences } from "@/hooks/usePreferences";

export function Nav() {
  const { dark, a11y, lowCarbon, toggleDark, toggleA11y, toggleLowCarbon } = usePreferences();

  return (
    <Flex
      as="nav"
      align="center"
      justify="between"
      aria-label="Main navigation"
      className="mx-auto max-w-6xl px-6 py-5"
    >
      <Flex align="center" gap="md">
        <Link to="/" className="text-lg font-bold tracking-tight">
          ColorX
        </Link>
        <Link
          to="/upload"
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Upload a light theme to convert to dark"
        >
          <Upload className="size-3.5" aria-hidden="true" />
          Upload Theme
        </Link>
      </Flex>

      <Flex align="center" gap="xs">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDark}
                aria-pressed={dark}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            }
          />
          <TooltipContent>
            {dark ? "Light mode" : "Dark mode"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant={a11y ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleA11y}
                aria-pressed={a11y}
                aria-label={a11y ? "Disable accessibility mode" : "Enable accessibility mode"}
              >
                <Accessibility className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>
            {a11y ? "Disable A11y mode" : "A11y mode"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant={lowCarbon ? "secondary" : "ghost"}
                size="icon"
                onClick={toggleLowCarbon}
                aria-pressed={lowCarbon}
                aria-label={lowCarbon ? "Disable low carbon mode" : "Enable low carbon mode"}
              >
                <Leaf className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>
            {lowCarbon ? "Disable Low Carbon" : "Low Carbon mode"}
          </TooltipContent>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
