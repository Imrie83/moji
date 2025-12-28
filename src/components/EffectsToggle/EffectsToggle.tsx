import { IconButton, Tooltip } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAppSettingsStore } from "../../store/appSettingsStore";

export function EffectsToggle() {
  const { effectsLevel, setEffectsLevel } = useAppSettingsStore();
  const isPremium = effectsLevel === "premium";

  const handleToggle = () => {
    setEffectsLevel(isPremium ? "standard" : "premium");
  };

  return (
    <Tooltip title={isPremium ? "Disable Premium FX" : "Enable Premium FX"}>
      <IconButton
        onClick={handleToggle}
        color={isPremium ? "primary" : "inherit"}
        size="small"
        aria-label="Toggle effects level"
      >
        <AutoAwesomeIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
