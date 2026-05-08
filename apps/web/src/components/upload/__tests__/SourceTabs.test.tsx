import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import { SourceTabs } from "../SourceTabs";

describe("SourceTabs", () => {
  it("renders three source tabs", () => {
    renderWithProviders(<SourceTabs onParsed={() => {}} />);
    expect(screen.getByRole("tab", { name: /file/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /figma/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /pdf/i })).toBeInTheDocument();
  });

  it("file tab is active by default and shows the upload form", () => {
    renderWithProviders(<SourceTabs onParsed={() => {}} />);
    expect(screen.getByRole("tab", { name: /file/i })).toHaveAttribute(
      "data-active"
    );
    expect(
      screen.getByRole("heading", { name: /upload a theme/i })
    ).toBeInTheDocument();
  });

  it("switches to the Figma tab and shows the Figma form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SourceTabs onParsed={() => {}} />);

    await user.click(screen.getByRole("tab", { name: /figma/i }));

    expect(
      screen.getByRole("heading", { name: /import from figma/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/figma file url/i)).toBeInTheDocument();
  });

  it("switches to the PDF tab and shows the PDF form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SourceTabs onParsed={() => {}} />);

    await user.click(screen.getByRole("tab", { name: /pdf/i }));

    expect(
      screen.getByRole("heading", { name: /extract from pdf/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: /pdf drop zone/i })
    ).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <SourceTabs onParsed={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
