import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import { generateLightTheme, generateDarkVariants } from "@colorx/core";
import { DarkVariantsTabs } from "../DarkVariantsTabs";

const VARIANTS = generateDarkVariants(generateLightTheme("#6366f1"));

describe("DarkVariantsTabs", () => {
  it("renders one tab per variant", () => {
    renderWithProviders(
      <DarkVariantsTabs variants={VARIANTS} sourceName="tokens.json" />
    );
    expect(screen.getByRole("tab", { name: /standard/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /true dark/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /dim/i })).toBeInTheDocument();
  });

  it("activates the first variant by default", () => {
    renderWithProviders(
      <DarkVariantsTabs variants={VARIANTS} sourceName="tokens.json" />
    );
    const standard = screen.getByRole("tab", { name: /standard/i });
    expect(standard).toHaveAttribute("data-active");
  });

  it("switches active variant when a tab is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DarkVariantsTabs variants={VARIANTS} sourceName="tokens.json" />
    );

    const trueDark = screen.getByRole("tab", { name: /true dark/i });
    await user.click(trueDark);

    expect(trueDark).toHaveAttribute("data-active");
  });

  it("renders the active variant description", () => {
    renderWithProviders(
      <DarkVariantsTabs variants={VARIANTS} sourceName="tokens.json" />
    );
    expect(screen.getByText(VARIANTS[0].description)).toBeInTheDocument();
  });

  it("renders Copy and Download actions for the active variant", () => {
    renderWithProviders(
      <DarkVariantsTabs variants={VARIANTS} sourceName="tokens.json" />
    );
    expect(
      screen.getByRole("button", { name: /copy .* dark theme css/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download standard dark theme/i })
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <DarkVariantsTabs variants={VARIANTS} sourceName="tokens.json" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
