import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SettingsButton } from './SettingsButton';

describe('SettingsButton', () => {
    it('should render settings button', () => {
        render(<SettingsButton />);

        const button = screen.getByRole('button', { name: /settings/i });
        expect(button).toBeInTheDocument();
    });

    it('should call onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();

        render(<SettingsButton onClick={handleClick} />);

        const button = screen.getByRole('button', { name: /settings/i });
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should work without onClick handler', async () => {
        const user = userEvent.setup();

        render(<SettingsButton />);

        const button = screen.getByRole('button', { name: /settings/i });
        // Should not throw
        await user.click(button);

        expect(button).toBeInTheDocument();
    });
});
