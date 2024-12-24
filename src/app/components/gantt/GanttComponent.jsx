import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { CircularProgress, Box, Typography } from "@mui/material";

const GanttChart = ({ data, height }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]); // Atualiza o estado de loading quando os dados mudam

  console.log("data", data);

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          mt: 3,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Chart
      chartType="Gantt"
      data={data}
      options={{
        gantt: {
          criticalPathEnabled: true,
        },
      }}
      width="100%"
      height={height || "400px"}
      chartVersion="51"
    />
  );
};

export default GanttChart;
