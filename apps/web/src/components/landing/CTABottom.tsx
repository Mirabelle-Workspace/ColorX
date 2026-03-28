import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function CTABottom() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Card className="rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] px-10 py-14 text-white ring-0">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Ready to build your theme?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Pick a color and get accessible light and dark themes in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/generator" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Open the Generator
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}
