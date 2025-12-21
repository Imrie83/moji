import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ParticlesEffect } from './ParticlesEffect';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock @tsparticles/react
vi.mock('@tsparticles/react', () => ({
    default: ({ id, options }: any) => (
        <div data-testid="mock-particles" id={id} data-options={JSON.stringify(options)} />
    ),
}));

describe('ParticlesEffect', () => {
    const theme = createTheme();

    it('should render particles component with unique id', () => {
        const testId = 'test-particles-id';
        const { getByTestId } = render(
            <ThemeProvider theme={theme}>
                <ParticlesEffect id={testId} />
            </ThemeProvider>
        );

        const particles = getByTestId('mock-particles');
        expect(particles).toBeInTheDocument();
        expect(particles.id).toBe(testId);
    });

    it('should pass correct options to particles component', () => {
        const { getByTestId } = render(
            <ThemeProvider theme={theme}>
                <ParticlesEffect id="test-id" />
            </ThemeProvider>
        );

        const particles = getByTestId('mock-particles');
        const options = JSON.parse(particles.getAttribute('data-options') || '{}');

        expect(options.fullScreen.enable).toBe(false);
        expect(options.particles.color.value).toBe(theme.palette.success.main);
        expect(options.particles.shape.type).toBe('star');
        expect(options.emitters.rate.quantity).toBe(15);
    });
});
