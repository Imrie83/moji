import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { AnswerInput } from './AnswerInput';

describe('AnswerInput', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        disabled: false,
        autoFocus: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the input field with correct label', () => {
        render(<AnswerInput {...defaultProps} />);
        expect(screen.getByLabelText(/reading \(hiragana\)/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/type romaji/i)).toBeInTheDocument();
    });

    it('updates local state when typing', async () => {
        const user = userEvent.setup();
        render(<AnswerInput {...defaultProps} />);

        const input = screen.getByPlaceholderText(/type romaji/i);
        await user.type(input, 'a');

        expect(input).toHaveValue('あ');
    });

    it('calls onSubmit when Enter is pressed with value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<AnswerInput {...defaultProps} onSubmit={onSubmit} />);

        const input = screen.getByPlaceholderText(/type romaji/i);
        await user.type(input, 'test{Enter}');

        expect(onSubmit).toHaveBeenCalledWith('てst');
        expect(input).toHaveValue(''); // Should clear after submit
    });

    it('does not call onSubmit when Enter is pressed with empty value', async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<AnswerInput {...defaultProps} onSubmit={onSubmit} />);

        const input = screen.getByPlaceholderText(/type romaji/i);
        await user.type(input, '{Enter}');

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('is disabled when the disabled prop is true', () => {
        render(<AnswerInput {...defaultProps} disabled={true} />);
        const input = screen.getByPlaceholderText(/type romaji/i);
        expect(input).toBeDisabled();
    });

    it('auto-focuses on mount', () => {
        render(<AnswerInput {...defaultProps} />);
        const input = screen.getByPlaceholderText(/type romaji/i);
        expect(input).toHaveFocus();
    });
});
