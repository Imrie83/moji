import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../theme/theme';

export function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={lightTheme}>
            {children}
        </ThemeProvider>
    );
}
