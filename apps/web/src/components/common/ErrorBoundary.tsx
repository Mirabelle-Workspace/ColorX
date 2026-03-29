import { Component, type ErrorInfo, type ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/primitives";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container as="main" className="py-20">
          <Card className="mx-auto max-w-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => this.setState({ hasError: false })}>
                Try again
              </Button>
            </CardContent>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}
