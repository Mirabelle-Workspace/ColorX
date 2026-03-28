import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CopyButton } from "./CopyButton";

interface CSSOutputProps {
  css: string;
}

export function CSSOutput({ css }: CSSOutputProps) {
  return (
    <section aria-label="CSS output" className="mt-8">
      <Card className="bg-[#1e1e1e] text-[#d4d4d4]">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-[#aaa]">
            CSS Variables
          </CardTitle>
          <CopyButton text={css} />
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto text-[0.8rem] leading-relaxed">
            <code>{css}</code>
          </pre>
        </CardContent>
      </Card>
    </section>
  );
}
