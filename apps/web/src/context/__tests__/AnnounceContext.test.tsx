import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnnounceProvider } from "../AnnounceContext";
import { useAnnounce } from "@/hooks/useAnnounce";

function AnnounceButton({ message }: { message: string }) {
  const announce = useAnnounce();
  return <button onClick={() => announce(message)}>Announce</button>;
}

describe("AnnounceProvider", () => {
  it("renders an aria-live region with role status", () => {
    render(
      <AnnounceProvider>
        <div>child</div>
      </AnnounceProvider>
    );
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("starts with an empty live region", () => {
    render(
      <AnnounceProvider>
        <div>child</div>
      </AnnounceProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("populates the live region when announce is called", async () => {
    const user = userEvent.setup();
    render(
      <AnnounceProvider>
        <AnnounceButton message="Theme generated for #ff0000" />
      </AnnounceProvider>
    );

    await user.click(screen.getByText("Announce"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Theme generated for #ff0000"
      );
    });
  });

  it("clears the live region after the timeout", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <AnnounceProvider>
        <AnnounceButton message="Done" />
      </AnnounceProvider>
    );

    await user.click(screen.getByText("Announce"));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Done");
    });

    vi.advanceTimersByTime(3500);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("");
    });

    vi.useRealTimers();
  });

  it("applies sr-only class to the live region for visual hiding", () => {
    render(
      <AnnounceProvider>
        <div>child</div>
      </AnnounceProvider>
    );
    expect(screen.getByRole("status").className).toContain("sr-only");
  });

  it("renders children correctly", () => {
    render(
      <AnnounceProvider>
        <p>Hello world</p>
      </AnnounceProvider>
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });
});
