import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsBar } from './SettingsBar';
import { useAppSettingsStore } from '../../store/appSettingsStore';

describe('SettingsBar', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({ theme: 'light' });
    });

    it('should render settings bar container', () => {
        render(<SettingsBar />);
        expect(screen.getByTestId('settings-bar')).toBeInTheDocument();
    });

    it('should render desktop components', () => {
        render(<SettingsBar />);

        // Desktop container should be visible
        expect(screen.getByTestId('desktop-bar')).toBeVisible();

        // Check contents are present in document
        expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
    });

    it('should show simplified view on mobile (hidden on desktop)', () => {
        render(<SettingsBar />);

        // Mobile container should be in document but hidden (default desktop view)
        expect(screen.getByTestId('mobile-bar')).not.toBeVisible();
    });

    it('should have all major components integrated', () => {
        render(<SettingsBar />);

        // Verify all major components are rendered in the DOM
        expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();

        const toggles = screen.getAllByRole('switch');
        expect(toggles.length).toBeGreaterThan(0);

        expect(screen.getByRole('button', { name: /open menu/i, hidden: true })).toBeInTheDocument();
    });
});
