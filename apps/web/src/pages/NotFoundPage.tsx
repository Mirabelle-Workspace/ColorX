import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Container, Flex } from "@/components/layout/primitives";

export function NotFoundPage() {
  return (
    <Container as="article" className="py-20">
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-extrabold">404</CardTitle>
          <CardDescription>
            This page doesn't exist. Maybe you were looking for the generator?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Flex gap="sm">
            <Link to="/" className={buttonVariants({ variant: "secondary" })}>
              Home
            </Link>
            <Link to="/generator" className={buttonVariants()}>
              Open Generator
            </Link>
          </Flex>
        </CardContent>
      </Card>
    </Container>
  );
}
