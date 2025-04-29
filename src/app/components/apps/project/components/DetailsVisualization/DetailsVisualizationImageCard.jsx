import { Box, Typography } from "@mui/material";

export default function DetailsVisualizationImageCard({ image }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: 160,
        height: 120,
        borderRadius: 2,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src={image.url}
        alt={image.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          bgcolor: "rgba(0,0,0,0.4)",
          color: "#fff",
          px: 1,
          py: 0.5,
        }}
      >
        <Typography variant="caption" fontWeight={500} noWrap>
          {image.name}
        </Typography>
      </Box>
    </Box>
  );
}
