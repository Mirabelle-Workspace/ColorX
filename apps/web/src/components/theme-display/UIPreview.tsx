import type { ThemeColors } from "@colorx/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flex, Stack } from "@/components/layout/primitives";

interface UIPreviewProps {
  theme: ThemeColors;
}

export function UIPreview({ theme }: UIPreviewProps) {
  return (
    <Card
      className="border p-5"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        borderColor: theme.border,
      }}
      aria-label="UI preview"
    >
      <CardContent className="p-0">
        <Stack gap="sm">
          <h4 className="text-sm font-semibold" style={{ color: theme.text }}>
            UI Preview
          </h4>
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            Secondary text looks like this. Used for descriptions and metadata.
          </p>
          <p className="text-xs" style={{ color: theme.textMuted }}>
            Muted text for timestamps and less important content.
          </p>
          <Flex as="nav" gap="sm" wrap>
            <Button
              size="sm"
              style={{ backgroundColor: theme.primary, color: theme.primaryText }}
            >
              Primary Button
            </Button>
            <Button
              size="sm"
              style={{ backgroundColor: theme.primaryHover, color: theme.primaryText }}
            >
              Hover State
            </Button>
            <Button
              variant="outline"
              size="sm"
              style={{ borderColor: theme.primary, color: theme.primary, backgroundColor: "transparent" }}
            >
              Outline
            </Button>
          </Flex>
          <Card
            className="border p-4"
            style={{ backgroundColor: theme.surface, borderColor: theme.borderLight }}
          >
            <p className="mb-1 text-sm font-semibold">Surface Card</p>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Content on a surface background.
            </p>
          </Card>
          <Flex as="ul" gap="sm" wrap>
            <li><Badge style={{ color: theme.success }} variant="secondary">Success</Badge></li>
            <li><Badge style={{ color: theme.warning }} variant="secondary">Warning</Badge></li>
            <li><Badge style={{ color: theme.error }} variant="secondary">Error</Badge></li>
            <li><Badge style={{ color: theme.info }} variant="secondary">Info</Badge></li>
          </Flex>
        </Stack>
      </CardContent>
    </Card>
  );
}
