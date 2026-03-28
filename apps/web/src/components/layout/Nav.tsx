import { Link, useLocation } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { Flex } from "@/components/layout/primitives";

export function Nav() {
  const location = useLocation();
  const isGenerator = location.pathname === "/generator";

  return (
    <Flex as="nav" align="center" justify="between" aria-label="Main navigation" className="mx-auto max-w-6xl px-6 py-5">
      <Link to="/" className="text-lg font-bold tracking-tight">
        ColorX
      </Link>
      {isGenerator ? (
        <Link to="/" className={buttonVariants({ variant: "secondary", size: "sm" })}>
          How It Works
        </Link>
      ) : (
        <Link to="/generator" className={buttonVariants({ size: "sm" })}>
          Open Generator
        </Link>
      )}
    </Flex>
  );
}
