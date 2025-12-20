import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SettingsActions } from './SettingsActions';

describe('SettingsActions', () => {
    it('should render all three action buttons', () => {
        render(<SettingsActions />);

        expect(screen.getByRole('button', { name: 'Action 1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action 2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Action 3' })).toBeInTheDocument();
    });

    it('should have clickable buttons', async () => {
        const user = userEvent.setup();

        render(<SettingsActions />);

        const button1 = screen.getByRole('button', { name: 'Action 1' });
        const button2 = screen.getByRole('button', { name: 'Action 2' });
        const button3 = screen.getByRole('button', { name: 'Action 3' });

        // Should not throw when clicked
        await user.click(button1);
        await user.click(button2);
        await user.click(button3);

        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
        expect(button3).toBeInTheDocument();
    });
});
