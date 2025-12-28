import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Backdrop,
  lighten,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, memo, useRef, useEffect, useCallback } from "react";
import type { Kanji } from "../../interfaces/kanji";
import type { Kana } from "../../interfaces/kana";

interface CharacterSelectionModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string;
  readonly items: readonly (Kanji | Kana)[];
  readonly excludedItems: ReadonlySet<string>;
  readonly onToggle: (char: string) => void;
  readonly onToggleAll: (items: string[], excluded: boolean) => void;
  readonly gridType?: "responsive" | "kana";
}

interface SelectionItemProps {
  readonly item: Kanji | Kana;
  readonly isSelected: boolean;
  readonly onToggle: (char: string) => void;
}

const SelectionItem = memo(
  ({ item, isSelected, onToggle }: SelectionItemProps) => {
    const theme = useTheme();
    return (
      <Box
        onClick={() => onToggle(item.character)}
        sx={{
          border: 1,
          borderColor: isSelected ? "divider" : "transparent",
          borderRadius: 2, // Slightly more rounded like a card
          bgcolor: (() => {
            if (!isSelected) return "transparent";
            if (theme.palette.mode === "dark")
              return lighten(theme.palette.background.paper, 0.1);
            return "background.paper";
          })(),
          color: isSelected ? "text.primary" : "text.disabled",
          boxShadow: isSelected ? theme.shadows[2] : "none",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          transition: "all 0.2s",
          opacity: isSelected ? 1 : 0.7,
          "&:hover": {
            opacity: 1,
            transform: "scale(1.02)",
            bgcolor: isSelected ? "background.paper" : "action.hover",
          },
          userSelect: "none",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: isSelected ? "bold" : "normal" }}
        >
          {item.character}
        </Typography>
      </Box>
    );
  }
);

export function CharacterSelectionModal({
  open,
  onClose,
  title,
  description,
  items,
  excludedItems,
  onToggle,
  onToggleAll,
  gridType = "responsive",
}: CharacterSelectionModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Create a stable callback for onToggle to prevent re-rendering all items
  // parents pass a new onToggle reference every render because it depends on excludedItems
  const onToggleRef = useRef(onToggle);
  useEffect(() => {
    onToggleRef.current = onToggle;
  });

  const stableOnToggle = useCallback((char: string) => {
    onToggleRef.current(char);
  }, []);

  // Calculate stats
  const total = items.length;
  const selected =
    total - items.filter((i) => excludedItems.has(i.character)).length;
  const allSelected = selected === total;

  const [loading, setLoading] = useState(false);

  const performBulkToggle = (chars: string[]) => {
    onToggleAll(chars, allSelected);

    // Wait for React to commit the update and browser to paint the new items state
    // forcing the spinner to stay visible during the paint.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setLoading(false);
        }, 0);
      });
    });
  };

  const handleToggleAll = () => {
    setLoading(true);
    // Use setTimeout to allow the UI to render the loading spinner before processing the heavy update
    setTimeout(() => {
      const chars = items.map((i) => i.character);
      performBulkToggle(chars);
    }, 0);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            maxHeight: fullScreen ? "100%" : "90vh",
            p: 0,
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
              {title}
            </Typography>
          </Box>
          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
            Selected: <b>{selected}</b> / {total}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {/* Content */}
      <DialogContent dividers sx={{ p: 1 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button size="small" onClick={handleToggleAll}>
            {allSelected ? "Deselect All" : "Select All"}
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              gridType === "kana"
                ? "repeat(5, 1fr)"
                : "repeat(auto-fill, minmax(60px, 1fr))",
            gap: 1,
          }}
        >
          {items.map((item) => (
            <SelectionItem
              key={item.character}
              item={item}
              isSelected={!excludedItems.has(item.character)}
              onToggle={stableOnToggle}
            />
          ))}
        </Box>
      </DialogContent>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 2, // Higher than dialog
          position: "absolute",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
