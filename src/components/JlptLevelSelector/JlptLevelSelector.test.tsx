import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { JlptLevelSelector } from './JlptLevelSelector';
import { useAppSettingsStore } from '../../store/appSettingsStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('JlptLevelSelector', () => {
    beforeEach(() => {
        useAppSettingsStore.setState({
            jlptLevels: new Set(['N5'])
        });
    });

    it('renders all three JLPT level buttons', () => {
        render(<JlptLevelSelector />);

        expect(screen.getByRole('button', { name: /toggle n5/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /toggle n4/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /toggle n3/i })).toBeInTheDocument();
    });

    it('shows N5 as selected by default', () => {
        render(<JlptLevelSelector />);

        const n5Button = screen.getByRole('button', { name: /toggle n5/i });
        expect(n5Button).toHaveClass('MuiIconButton-colorPrimary');
    });

    it('toggles level selection when clicked', async () => {
        const user = userEvent.setup();
        render(<JlptLevelSelector />);

        const n4Button = screen.getByRole('button', { name: /toggle n4/i });

        expect(n4Button).not.toHaveClass('MuiIconButton-colorPrimary');

        await user.click(n4Button);

        // Now selected
        expect(n4Button).toHaveClass('MuiIconButton-colorPrimary');
        expect(useAppSettingsStore.getState().jlptLevels.has('N4')).toBe(true);
    });

    it('allows multiple levels to be selected', async () => {
        const user = userEvent.setup();
        render(<JlptLevelSelector />);

        const n4Button = screen.getByRole('button', { name: /toggle n4/i });
        const n3Button = screen.getByRole('button', { name: /toggle n3/i });

        await user.click(n4Button);
        await user.click(n3Button);

        const state = useAppSettingsStore.getState();
        expect(state.jlptLevels.has('N5')).toBe(true);
        expect(state.jlptLevels.has('N4')).toBe(true);
        expect(state.jlptLevels.has('N3')).toBe(true);
    });

    it('deselects a level when clicked again if other levels are selected', async () => {
        const user = userEvent.setup();
        render(<JlptLevelSelector />);

        // Select N4 first
        const n4Button = screen.getByRole('button', { name: /toggle n4/i });
        await user.click(n4Button);

        // Deselect N5
        const n5Button = screen.getByRole('button', { name: /toggle n5/i });
        await user.click(n5Button);

        const state = useAppSettingsStore.getState();
        expect(state.jlptLevels.has('N5')).toBe(false);
        expect(state.jlptLevels.has('N4')).toBe(true);
    });

    it('prevents deselecting the last remaining level', async () => {
        const user = userEvent.setup();
        render(<JlptLevelSelector />);

        const n5Button = screen.getByRole('button', { name: /toggle n5/i });

        // Try to deselect the only selected level
        await user.click(n5Button);

        // Should still be selected
        const state = useAppSettingsStore.getState();
        expect(state.jlptLevels.has('N5')).toBe(true);
        expect(state.jlptLevels.size).toBe(1);
    });
});
