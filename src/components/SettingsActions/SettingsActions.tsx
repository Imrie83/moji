import { Button, Box } from '@mui/material';

export function SettingsActions() {
    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button variant="outlined" size="small">
                Action 1
            </Button>
            <Button variant="outlined" size="small">
                Action 2
            </Button>
            <Button variant="outlined" size="small">
                Action 3
            </Button>
        </Box>
    );
}
