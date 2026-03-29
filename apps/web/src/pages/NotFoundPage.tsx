import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Container, Flex } from "@/components/layout/primitives";

export function NotFoundPage() {
  const navigate = useNavigate();

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
            <Button variant="secondary" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button onClick={() => navigate("/generator")}>
              Open Generator
            </Button>
          </Flex>
        </CardContent>
      </Card>
    </Container>
  );
}
