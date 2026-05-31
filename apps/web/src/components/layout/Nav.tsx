import { Link, useNavigate } from "react-router";
import { Moon, Sun, Accessibility, Leaf, Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Flex } from "@/components/layout/primitives";
import { usePreferences } from "@/hooks/usePreferences";

export function Nav() {
  const navigate = useNavigate();
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/upload")}
          aria-label="Convert a theme between light and dark"
        >
          <Upload className="mr-1.5 size-3.5" aria-hidden="true" />
          Convert Theme
        </Button>
      </Flex>

      <Flex align="center" gap="xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open("https://www.mirabelledoiron.com/", "_blank", "noopener,noreferrer")
          }
          aria-label="Portfolio (opens in new tab)"
        >
          <span>Portfolio</span>
          <ExternalLink className="ml-1 size-4" aria-hidden="true" />
        </Button>

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
