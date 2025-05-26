import { Chip, useTheme } from "@mui/material";

export default function JourneyCounterChip({ count, is_finished = false }) {
    const theme = useTheme();

    const getBgColor = (count, is_finished) => {
        if (is_finished) return theme.palette.success.main;
        const ratio = Math.min(count, 40) / 40;
        const hue = (1 - ratio) * 120;
        return `hsl(${hue}, 100%, 40%)`;
    };

    const bgColor = getBgColor(count, is_finished);

    return (
        <Chip
            label={`${count || 0} dias`}
            size="small"
            sx={{
                bgcolor: bgColor,
                color: theme.palette.getContrastText(bgColor),
            }}
        />
    );
}