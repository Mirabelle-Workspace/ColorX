import { useNavigate } from "react-router";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flex } from "@/components/layout/primitives";
import { AnimateIn } from "@/components/common/AnimateIn";

export function CTABottom() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <AnimateIn>
        <Card className="rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] px-10 py-14 text-white ring-0">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Ready to build your theme?
            </CardTitle>
            <CardDescription className="text-[#aaa]">
              Pick a color and get accessible light and dark themes in seconds.
              Already have a light theme? Upload it to get three dark options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Flex gap="sm" wrap>
              <Button size="lg" variant="secondary" onClick={() => navigate("/generator")}>
                Open the Generator
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => navigate("/upload")}
              >
                <Upload className="mr-2 size-4" aria-hidden="true" />
                Upload a Light Theme
              </Button>
            </Flex>
          </CardContent>
        </Card>
      </AnimateIn>
    </section>
  );
}
