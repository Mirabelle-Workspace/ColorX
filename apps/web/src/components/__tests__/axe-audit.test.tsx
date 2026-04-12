import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test/test-utils";
import { ColorForm } from "../color-input/ColorForm";
import { SkipLink } from "../layout/SkipLink";

describe("Accessibility (axe) audits", () => {
  it("ColorForm has no axe violations", async () => {
    const { container } = renderWithProviders(<ColorForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SkipLink has no axe violations", async () => {
    const { container } = renderWithProviders(<SkipLink />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
