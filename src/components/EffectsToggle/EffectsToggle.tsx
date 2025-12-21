import { Switch, Box, Typography, Tooltip, FormControlLabel } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useAppSettingsStore } from '../../store/appSettingsStore';

export function EffectsToggle() {
    const { effectsLevel, setEffectsLevel } = useAppSettingsStore();
    const isPremium = effectsLevel === 'premium';

    const handleToggle = () => {
        setEffectsLevel(isPremium ? 'standard' : 'premium');
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isPremium ? "Premium FX Active" : "Standard FX"}>
                <AutoAwesomeIcon
                    fontSize="small"
                    color={isPremium ? "primary" : "disabled"}
                    sx={{ transition: 'color 0.3s ease' }}
                />
            </Tooltip>
            {/* Desktop Label */}
            <Typography variant="body2" sx={{ display: { xs: 'none', lg: 'block' }, color: 'text.secondary', fontSize: '0.75rem' }}>
                FX
            </Typography>
            {/* Switch with label for accessibility/testing */}
            <FormControlLabel
                control={
                    <Switch
                        checked={isPremium}
                        onChange={handleToggle}
                        size="small"
                        color="primary"
                    />
                }
                label="Premium FX"
                labelPlacement="end"
                sx={{
                    margin: 0,
                    // Hide label text on desktop SettingsBar if needed, but for now we keep it simple
                    '& .MuiFormControlLabel-label': {
                        display: { xs: 'none', lg: 'none' }, // Keep label hidden but present for screen readers
                        fontSize: '0.75rem'
                    }
                }}
            />
        </Box>
    );
}
