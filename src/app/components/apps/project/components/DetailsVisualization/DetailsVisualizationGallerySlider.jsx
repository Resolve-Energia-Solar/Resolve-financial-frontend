// components/ImageGallery/GallerySlider.jsx
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useRef } from "react";
import DetailsVisualizationImageCard from "./DetailsVisualizationImageCard";

export default function DetailsVisualizationGallerySlider({ images }) {
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={() => scroll("left")}
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          zIndex: 2,
          transform: "translateY(-50%)",
        }}
      >
        <ChevronLeft />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 5,
          py: 1,
          scrollBehavior: "smooth",
        }}
      >
        {images.map((img, index) => (
          <DetailsVisualizationImageCard key={index} image={img} />
        ))}
      </Box>

      <IconButton
        onClick={() => scroll("right")}
        sx={{
          position: "absolute",
          top: "50%",
          right: 0,
          zIndex: 2,
          transform: "translateY(-50%)",
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
