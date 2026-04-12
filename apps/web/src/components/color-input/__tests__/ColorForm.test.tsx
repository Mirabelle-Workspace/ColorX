import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import { ColorForm } from "../ColorForm";

describe("ColorForm", () => {
  it("renders the color picker and hex input", () => {
    renderWithProviders(<ColorForm />);
    expect(screen.getByLabelText("Color picker")).toBeInTheDocument();
    expect(screen.getByLabelText("Hex color value")).toBeInTheDocument();
  });

  it("renders a submit button labeled Generate Theme", () => {
    renderWithProviders(<ColorForm />);
    expect(
      screen.getByRole("button", { name: /generate theme/i })
    ).toBeInTheDocument();
  });

  it("has a fieldset with a sr-only legend for screen readers", () => {
    renderWithProviders(<ColorForm />);
    expect(screen.getByText("Pick a color")).toBeInTheDocument();
  });

  it("initializes hex input with the context value", () => {
    renderWithProviders(<ColorForm />, {
      themeOverrides: { hex: "#abcdef" },
    });
    expect(screen.getByLabelText("Hex color value")).toHaveValue("#abcdef");
  });

  it("accepts typed hex input without the hash prefix", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorForm />);

    const input = screen.getByLabelText("Hex color value");
    await user.clear(input);
    // After clear, the auto-prepend sets value to "#"
    // Typing 6 hex chars produces a valid 7-char value
    await user.type(input, "ff0000");

    expect(input).toHaveValue("#ff0000");
  });

  it("disables the submit button when hex is too short", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorForm />);

    const input = screen.getByLabelText("Hex color value");
    await user.clear(input);
    await user.type(input, "gg");

    expect(
      screen.getByRole("button", { name: /generate theme/i })
    ).toBeDisabled();
  });

  it("enables the submit button for a valid 6-digit hex", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorForm />);

    const input = screen.getByLabelText("Hex color value");
    await user.clear(input);
    await user.type(input, "abcdef");

    expect(
      screen.getByRole("button", { name: /generate theme/i })
    ).toBeEnabled();
  });

  it("calls setHex on form submission with a valid hex", async () => {
    const setHex = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<ColorForm />, {
      themeOverrides: { hex: "#6366f1", setHex },
    });

    const input = screen.getByLabelText("Hex color value");
    await user.clear(input);
    await user.type(input, "ff0000");
    await user.click(
      screen.getByRole("button", { name: /generate theme/i })
    );

    expect(setHex).toHaveBeenCalledWith("#ff0000");
  });

  it("does not call setHex when hex is invalid", async () => {
    const setHex = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<ColorForm />, {
      themeOverrides: { hex: "#6366f1", setHex },
    });

    const input = screen.getByLabelText("Hex color value");
    await user.clear(input);
    await user.type(input, "zz");
    await user.click(
      screen.getByRole("button", { name: /generate theme/i })
    );

    expect(setHex).not.toHaveBeenCalled();
  });

  it("has an aria-live region for screen reader announcements", () => {
    renderWithProviders(<ColorForm />);
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
  });
});
