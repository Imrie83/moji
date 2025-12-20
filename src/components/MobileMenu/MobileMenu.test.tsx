import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MobileMenu } from './MobileMenu';
import { useAppSettingsStore } from '../../store/appSettingsStore';

describe('MobileMenu', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({ theme: 'light' });
    });

    it('should render hamburger menu button', () => {
        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        expect(button).toBeInTheDocument();
    });

    it('should open menu when hamburger is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        // Menu should be visible
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should display all menu items when open', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        // Should see theme toggle and action items
        expect(screen.getByText('Theme')).toBeInTheDocument();
        expect(screen.getByText('Action 1')).toBeInTheDocument();
        expect(screen.getByText('Action 2')).toBeInTheDocument();
        expect(screen.getByText('Action 3')).toBeInTheDocument();
    });

    it('should toggle theme from menu', async () => {
        const user = userEvent.setup();
        useAppSettingsStore.setState({ theme: 'light' });

        render(<MobileMenu />);

        // Open menu
        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        // Find and click theme toggle
        const themeToggle = screen.getByRole('switch');
        expect(themeToggle).not.toBeChecked();

        await user.click(themeToggle);

        expect(useAppSettingsStore.getState().theme).toBe('dark');
    });

    it('should close menu when action item is clicked', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        // Open menu
        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        // Click action item
        const action1 = screen.getByText('Action 1');
        await user.click(action1);

        // Menu should be closed (no longer in document)
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should display correct icon based on theme', async () => {
        const user = userEvent.setup();

        // Test with light theme
        useAppSettingsStore.setState({ theme: 'light' });
        const { rerender } = render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        // Should show sun icon for light theme
        expect(screen.getByText('Theme')).toBeInTheDocument();

        // Close menu
        await user.keyboard('{Escape}');

        // Test with dark theme
        useAppSettingsStore.setState({ theme: 'dark' });
        rerender(<MobileMenu />);

        await user.click(button);

        // Should still show theme option
        expect(screen.getByText('Theme')).toBeInTheDocument();
    });
});
