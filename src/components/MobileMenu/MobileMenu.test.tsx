import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MobileMenu } from './MobileMenu';
import { useAppSettingsStore } from '../../store/appSettingsStore';

describe('MobileMenu', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({ theme: 'light', effectsLevel: 'standard' });
        // Mock matchMedia
        window.matchMedia = vi.fn().mockImplementation(query => ({
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

    it('should render hamburger menu button', () => {
        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        expect(button).toBeInTheDocument();
    });

    it('should open menu and show toggles', async () => {
        const user = userEvent.setup();
        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        // Should see theme and fx toggles
        expect(await screen.findByText(/theme:/i)).toBeInTheDocument();
        expect(screen.getByText(/fx:/i)).toBeInTheDocument();
    });

    it('should toggle theme from menu', async () => {
        const user = userEvent.setup();
        useAppSettingsStore.setState({ theme: 'light' });

        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        const themeItem = await screen.findByText(/theme: light/i);
        await user.click(themeItem);

        expect(useAppSettingsStore.getState().theme).toBe('dark');
    });

    it('should toggle effects level from menu', async () => {
        const user = userEvent.setup();
        useAppSettingsStore.setState({ effectsLevel: 'standard' });

        render(<MobileMenu />);

        const button = screen.getByRole('button', { name: /open menu/i });
        await user.click(button);

        const effectsItem = await screen.findByText(/fx: standard/i);
        await user.click(effectsItem);

        expect(useAppSettingsStore.getState().effectsLevel).toBe('premium');
    });
});
