import { TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as wanakana from 'wanakana';

interface AnswerInputProps {
    onSubmit: (value: string) => void;
    disabled?: boolean;
    autoFocus?: boolean;
    value?: string; // Controlled from parent if needed, but we manage local state for wanakana bind
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
    onSubmit,
    disabled = false,
    autoFocus = true
}) => {
    const [inputVal, setInputVal] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            wanakana.bind(inputRef.current, { IMEMode: 'toHiragana' });
        }
        return () => {
            if (inputRef.current) {
                wanakana.unbind(inputRef.current);
            }
        };
    }, []);

    // Restore focus when input is re-enabled
    useEffect(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (inputVal.trim()) {
                onSubmit(inputVal);
                setInputVal('');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(e.target.value);
    };

    return (
        <TextField
            inputRef={inputRef}
            value={inputVal}
            onInput={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
            label="Reading (Hiragana)"
            variant="outlined"
            fullWidth
            placeholder="Type romaji..."
            autoComplete="off"
            sx={{ maxWidth: 400 }}
            data-testid="answer-input"
        />
    );
};
