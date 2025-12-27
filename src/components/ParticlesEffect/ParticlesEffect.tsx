import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { useTheme, Box } from "@mui/material";

interface ParticlesEffectProps {
    readonly id: string;
}

export function ParticlesEffect({ id }: ParticlesEffectProps) {
    const theme = useTheme();

    const options: ISourceOptions = useMemo(() => ({
        fullScreen: { enable: false },
        fpsLimit: 120,
        particles: {
            number: { value: 0 },
            color: { value: theme.palette.success.main },
            shape: { type: "star" },
            opacity: {
                value: { min: 0.1, max: 1 },
                animation: {
                    enable: true,
                    speed: 1,
                    startValue: "max",
                    destroy: "min"
                }
            },
            size: { value: { min: 1, max: 3 } },
            move: {
                enable: true,
                speed: { min: 5, max: 10 },
                direction: "outside",
                random: false,
                straight: false,
                outModes: { default: "destroy" },
                gravity: { enable: true, acceleration: 5 }
            }
        },
        emitters: {
            direction: "none",
            rate: {
                quantity: 15,
                delay: 0
            },
            size: {
                width: 0,
                height: 0
            },
            position: {
                x: 50,
                y: 50
            },
            life: {
                duration: 0.2,
                count: 1
            }
        }
    }), [theme.palette.success.main]);

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 100,
                overflow: "hidden"
            }}
        >
            <Particles
                id={id}
                options={options}
                className="particles-burst"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none"
                }}
            />
        </Box>
    );
}
