import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";
import { renderWithProviders, userEvent } from "@/test/test-utils";
import { FigmaForm } from "../FigmaForm";

const ORIGINAL_FETCH = globalThis.fetch;

interface MockResponseInit {
  ok: boolean;
  status: number;
  body: unknown;
}

function makeFetch(responses: MockResponseInit[]): typeof fetch {
  const queue = [...responses];
  return (async () => {
    const next = queue.shift();
    if (!next) throw new Error("No more mock responses");
    return {
      ok: next.ok,
      status: next.status,
      json: async () => next.body,
    } as Response;
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  sessionStorage.clear();
});

afterEach(() => {
  globalThis.fetch = ORIGINAL_FETCH;
  vi.restoreAllMocks();
});

describe("FigmaForm", () => {
  it("renders URL and token inputs with proper labels", () => {
    renderWithProviders(<FigmaForm onParsed={() => {}} />);
    expect(screen.getByLabelText(/figma file url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/personal access token/i)).toBeInTheDocument();
  });

  it("token input is type=password", () => {
    renderWithProviders(<FigmaForm onParsed={() => {}} />);
    const token = screen.getByLabelText(/personal access token/i);
    expect(token).toHaveAttribute("type", "password");
  });

  it("links to Figma's token docs", () => {
    renderWithProviders(<FigmaForm onParsed={() => {}} />);
    const link = screen.getByRole("link", { name: /how to create one/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.figma.com/developers/api#access-tokens"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("calls onParsed with extracted tokens on success", async () => {
    const stylesBody = {
      meta: {
        styles: [
          { key: "k1", node_id: "1:2", name: "Brand/Primary", style_type: "FILL" },
        ],
      },
    };
    const nodesBody = {
      nodes: {
        "1:2": {
          document: {
            fills: [{ type: "SOLID", color: { r: 0.388, g: 0.4, b: 0.945 } }],
          },
        },
      },
    };
    globalThis.fetch = makeFetch([
      { ok: true, status: 200, body: stylesBody },
      { ok: true, status: 200, body: nodesBody },
    ]);

    const onParsed = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<FigmaForm onParsed={onParsed} />);

    await user.type(
      screen.getByLabelText(/figma file url/i),
      "https://www.figma.com/design/aBcDeFgHiJ12/Test"
    );
    await user.type(
      screen.getByLabelText(/personal access token/i),
      "figd_abc1234567890"
    );
    await user.click(screen.getByRole("button", { name: /import from figma/i }));

    await waitFor(() => {
      expect(onParsed).toHaveBeenCalledTimes(1);
    });
    const result = onParsed.mock.calls[0][0];
    expect(result.fileName).toBe("figma-aBcDeFgHiJ12");
    expect(result.tokens).toHaveLength(1);
    expect(result.tokens[0].hex).toBe("#6366f1");
  });

  it("shows the API error in an alert region on failure", async () => {
    globalThis.fetch = makeFetch([
      { ok: false, status: 403, body: {} },
    ]);

    const user = userEvent.setup();
    renderWithProviders(<FigmaForm onParsed={() => {}} />);

    await user.type(
      screen.getByLabelText(/figma file url/i),
      "https://www.figma.com/design/aBcDeFgHiJ12/Test"
    );
    await user.type(
      screen.getByLabelText(/personal access token/i),
      "figd_abc1234567890"
    );
    await user.click(screen.getByRole("button", { name: /import from figma/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/unauthorized|invalid/i);
  });

  it("persists the token in sessionStorage on submit", async () => {
    globalThis.fetch = makeFetch([
      { ok: false, status: 403, body: {} },
    ]);

    const user = userEvent.setup();
    renderWithProviders(<FigmaForm onParsed={() => {}} />);
    await user.type(
      screen.getByLabelText(/figma file url/i),
      "https://www.figma.com/design/aBcDeFgHiJ12/Test"
    );
    await user.type(
      screen.getByLabelText(/personal access token/i),
      "figd_persist_test_token"
    );
    await user.click(screen.getByRole("button", { name: /import from figma/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("colorx.figma_token")).toBe(
        "figd_persist_test_token"
      );
    });
  });

  it("has no axe violations", async () => {
    const { container } = renderWithProviders(
      <FigmaForm onParsed={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
