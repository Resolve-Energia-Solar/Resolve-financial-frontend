import { Box, Grid, Typography } from "@mui/material";
import DetailsVisualizationGallerySlider from "./DetailsVisualizationGallerySlider";

export default function DetailsVisualizationGallery({ title, answerData }) {
  return (
    <Grid xs={12} sx={{ mt: 4 }}>
      <Typography fontWeight={600} fontSize={16} mb={2}>
        {title}
      </Typography>
      <DetailsVisualizationGallerySlider images={images} />
    </Grid>
  );
}
