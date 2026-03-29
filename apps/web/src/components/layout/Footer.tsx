import { Globe } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/layout/primitives";

export function Footer() {
  return (
    <footer className="w-full border-t border-border px-8 py-6">
      <Flex align="center" justify="between" className="mx-auto max-w-5xl">
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} Mirabelle Doiron
        </p>

        <Flex align="center" gap="xs">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open("https://www.mirabelledoiron.com/", "_blank", "noopener,noreferrer")}
            aria-label="Portfolio (opens in new tab)"
          >
            <Globe className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open("https://github.com/mirabelledoiron", "_blank", "noopener,noreferrer")}
            aria-label="GitHub (opens in new tab)"
          >
            <FaGithub className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.open("https://www.linkedin.com/in/mirabelledoiron", "_blank", "noopener,noreferrer")}
            aria-label="LinkedIn (opens in new tab)"
          >
            <FaLinkedinIn className="size-5" />
          </Button>
        </Flex>
      </Flex>
    </footer>
  );
}
