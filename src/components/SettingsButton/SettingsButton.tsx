import { IconButton } from '@mui/material';
import Settings from '@mui/icons-material/Settings';

interface SettingsButtonProps {
    onClick?: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
    return (
        <IconButton
            onClick={onClick}
            aria-label="Settings"
            color="default"
        >
            <Settings />
        </IconButton>
    );
}
