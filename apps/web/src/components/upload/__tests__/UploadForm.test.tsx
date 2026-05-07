import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import { UploadForm } from "../UploadForm";
import { generateLightTheme } from "@colorx/core";

const VALID_THEME = generateLightTheme("#6366f1");
const VALID_JSON = JSON.stringify(VALID_THEME);

function makeFile(content: string, name: string): File {
  return new File([content], name, { type: "text/plain" });
}

describe("UploadForm", () => {
  it("renders heading and help text", () => {
    renderWithProviders(<UploadForm onParsed={() => {}} />);
    expect(
      screen.getByRole("heading", { name: /upload a light theme/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Drop any JSON, JS, TS, or CSS file/i)
    ).toBeInTheDocument();
  });

  it("exposes the file input via accessible name", () => {
    renderWithProviders(<UploadForm onParsed={() => {}} />);
    expect(screen.getByLabelText(/theme file/i)).toBeInTheDocument();
  });

  it("renders a drop zone region with an accessible name", () => {
    renderWithProviders(<UploadForm onParsed={() => {}} />);
    expect(
      screen.getByRole("region", { name: /file drop zone/i })
    ).toBeInTheDocument();
  });

  it("calls onParsed with a complete theme when a full JSON file is uploaded", async () => {
    const onParsed = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<UploadForm onParsed={onParsed} />);

    const input = screen.getByLabelText(/theme file/i) as HTMLInputElement;
    await user.upload(input, makeFile(VALID_JSON, "tokens.json"));

    await waitFor(() => {
      expect(onParsed).toHaveBeenCalledTimes(1);
    });
    const result = onParsed.mock.calls[0][0];
    expect(result.theme).toEqual(VALID_THEME);
    expect(result.fileName).toBe("tokens.json");
    expect(result.mapped).toBeGreaterThan(0);
  });

  it("succeeds with a sparse file that only has primary -- no missing-token error", async () => {
    const onParsed = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<UploadForm onParsed={onParsed} />);

    const sparse = `:root { --primary: #6366f1; }`;
    const input = screen.getByLabelText(/theme file/i) as HTMLInputElement;
    await user.upload(input, makeFile(sparse, "tokens.css"));

    await waitFor(() => {
      expect(onParsed).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    const result = onParsed.mock.calls[0][0];
    expect(result.theme.primary).toBe("#6366f1");
    expect(result.synthesized).toBeGreaterThan(0);
  });

  it("succeeds with arbitrary token names by detecting primary heuristically", async () => {
    const onParsed = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<UploadForm onParsed={onParsed} />);

    const arbitrary = `:root {
      --my-weird-name-1: #6366f1;
      --my-weird-name-2: #ffffff;
    }`;
    const input = screen.getByLabelText(/theme file/i) as HTMLInputElement;
    await user.upload(input, makeFile(arbitrary, "tokens.css"));

    await waitFor(() => {
      expect(onParsed).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an alert when the file has no recognizable color tokens", async () => {
    const onParsed = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<UploadForm onParsed={onParsed} />);

    const input = screen.getByLabelText(/theme file/i) as HTMLInputElement;
    await user.upload(input, makeFile("{}", "empty.json"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(onParsed).not.toHaveBeenCalled();
  });

  it("announces success via the live region with mapped/synthesized counts", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UploadForm onParsed={() => {}} />);

    const input = screen.getByLabelText(/theme file/i) as HTMLInputElement;
    await user.upload(input, makeFile(VALID_JSON, "brand.json"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        /Parsed brand\.json/i
      );
    });
    expect(screen.getByRole("status")).toHaveTextContent(/synthesized/i);
  });

  it("has no axe violations in idle state", async () => {
    const { container } = renderWithProviders(<UploadForm onParsed={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in error state", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <UploadForm onParsed={() => {}} />
    );

    const input = screen.getByLabelText(/theme file/i) as HTMLInputElement;
    await user.upload(input, makeFile("{}", "empty.json"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
