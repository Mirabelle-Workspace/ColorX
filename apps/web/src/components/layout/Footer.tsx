import { Globe } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { Container, Flex, Stack } from "@/components/layout/primitives";

export function Footer() {
  return (
    <Container as="footer" className="py-10 text-center text-sm text-muted-foreground">
      <Separator className="mb-10" />
      <Stack gap="sm" className="items-center">
        <p className="font-medium text-foreground">
          2026 | Mirabelle Doiron
        </p>
        <p>
          Inspired by{" "}
          <a href="https://www.color-hex.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            color-hex.com
          </a>
          . Contrast standards from{" "}
          <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer" className="hover:underline">
            WCAG 2.1
          </a>{" "}
          and{" "}
          <a href="https://github.com/Myndex/SAPC-APCA" target="_blank" rel="noopener noreferrer" className="hover:underline">
            APCA
          </a>
          .
        </p>
        <Flex as="nav" gap="lg" align="center" justify="center">
          <a href="https://www.mirabelledoiron.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors hover:text-foreground">
            <Globe className="h-4 w-4" aria-hidden="true" />
            Portfolio
          </a>
          <a href="https://github.com/mirabelledoiron" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors hover:text-foreground">
            <FaGithub className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/mirabelledoiron" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors hover:text-foreground">
            <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
        </Flex>
      </Stack>
    </Container>
  );
}
