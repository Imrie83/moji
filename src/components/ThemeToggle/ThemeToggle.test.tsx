import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { useAppSettingsStore } from '../../store/appSettingsStore';

describe('ThemeToggle', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({ theme: 'system' });
    });

    it('should render theme toggle switch', () => {
        render(<ThemeToggle />);

        const toggle = screen.getByRole('switch');
        expect(toggle).toBeInTheDocument();
    });

    it('should toggle from light to dark theme', async () => {
        const user = userEvent.setup();
        useAppSettingsStore.setState({ theme: 'light' });

        render(<ThemeToggle />);

        const toggle = screen.getByRole('switch');
        expect(toggle).not.toBeChecked();

        await user.click(toggle);

        expect(useAppSettingsStore.getState().theme).toBe('dark');
    });

    it('should toggle from dark to light theme', async () => {
        const user = userEvent.setup();
        useAppSettingsStore.setState({ theme: 'dark' });

        render(<ThemeToggle />);

        const toggle = screen.getByRole('switch');
        expect(toggle).toBeChecked();

        await user.click(toggle);

        expect(useAppSettingsStore.getState().theme).toBe('light');
    });

    it('should respect system preference when theme is system', () => {
        // Mock matchMedia to return dark mode
        window.matchMedia = (query: string) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: () => { },
            removeListener: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            dispatchEvent: () => true,
        });

        useAppSettingsStore.setState({ theme: 'system' });

        render(<ThemeToggle />);

        const toggle = screen.getByRole('switch');
        // Should be checked because system preference is dark
        expect(toggle).toBeChecked();
    });

    it('should render sun and moon icons', () => {
        render(<ThemeToggle />);

        // Both icons should be rendered (as disabled buttons)
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(2);
    });
});
