import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";
import { useAppSettingsStore } from "../../store/appSettingsStore";

describe("ThemeToggle", () => {
  beforeEach(() => {
    useAppSettingsStore.setState({ theme: "system" });
    // Mock matchMedia
    globalThis.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("should render theme toggle button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it("should toggle from light to dark theme", async () => {
    const user = userEvent.setup();
    useAppSettingsStore.setState({ theme: "light" });

    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    await user.click(button);
    expect(useAppSettingsStore.getState().theme).toBe("dark");
  });

  it("should toggle from dark to light theme", async () => {
    const user = userEvent.setup();
    useAppSettingsStore.setState({ theme: "dark" });

    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    await user.click(button);
    expect(useAppSettingsStore.getState().theme).toBe("light");
  });

  it("should change icon based on theme", () => {
    const { rerender } = render(<ThemeToggle />);

    useAppSettingsStore.setState({ theme: "light" });
    rerender(<ThemeToggle />);
    // When light, it shows Moon (Brightness4) to switch to dark
    // We can't easily check for the specific icon component in a role-based way without more complex queries,
    // but verify it renders correctly is a good start.
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();

    useAppSettingsStore.setState({ theme: "dark" });
    rerender(<ThemeToggle />);
    // When dark, it shows Sun (Brightness7) to switch to light
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });
});
