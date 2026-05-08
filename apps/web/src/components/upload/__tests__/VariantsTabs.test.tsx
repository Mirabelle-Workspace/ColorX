import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import {
  generateLightTheme,
  generateDarkTheme,
  generateDarkVariants,
  generateLightVariants,
} from "@colorx/core";
import { VariantsTabs } from "../VariantsTabs";

const DARK_VARIANTS = generateDarkVariants(generateLightTheme("#6366f1"));
const LIGHT_VARIANTS = generateLightVariants(generateDarkTheme("#6366f1"));

describe("VariantsTabs (dark)", () => {
  it("renders one tab per dark variant", () => {
    renderWithProviders(
      <VariantsTabs
        variants={DARK_VARIANTS}
        mode="dark"
        sourceName="tokens.json"
        heading="Dark theme options"
      />
    );
    expect(screen.getByRole("tab", { name: /standard/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /true dark/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /dim/i })).toBeInTheDocument();
  });

  it("activates the first variant by default", () => {
    renderWithProviders(
      <VariantsTabs
        variants={DARK_VARIANTS}
        mode="dark"
        sourceName="tokens.json"
        heading="Dark theme options"
      />
    );
    expect(screen.getByRole("tab", { name: /standard/i })).toHaveAttribute(
      "data-active"
    );
  });

  it("switches active variant on tab click", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <VariantsTabs
        variants={DARK_VARIANTS}
        mode="dark"
        sourceName="tokens.json"
        heading="Dark theme options"
      />
    );
    const trueDark = screen.getByRole("tab", { name: /true dark/i });
    await user.click(trueDark);
    expect(trueDark).toHaveAttribute("data-active");
  });

  it("renders Copy and Download actions for the active variant", () => {
    renderWithProviders(
      <VariantsTabs
        variants={DARK_VARIANTS}
        mode="dark"
        sourceName="tokens.json"
        heading="Dark theme options"
      />
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
      <VariantsTabs
        variants={DARK_VARIANTS}
        mode="dark"
        sourceName="tokens.json"
        heading="Dark theme options"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("VariantsTabs (light)", () => {
  it("renders one tab per light variant", () => {
    renderWithProviders(
      <VariantsTabs
        variants={LIGHT_VARIANTS}
        mode="light"
        sourceName="dark-theme.json"
        heading="Light theme options"
      />
    );
    expect(screen.getByRole("tab", { name: /standard/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /soft/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /warm/i })).toBeInTheDocument();
  });

  it("download filename uses the light mode suffix", () => {
    renderWithProviders(
      <VariantsTabs
        variants={LIGHT_VARIANTS}
        mode="light"
        sourceName="dark-theme.json"
        heading="Light theme options"
      />
    );
    expect(
      screen.getByRole("button", { name: /download standard light theme/i })
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <VariantsTabs
        variants={LIGHT_VARIANTS}
        mode="light"
        sourceName="dark-theme.json"
        heading="Light theme options"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
