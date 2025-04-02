import React from 'react';
import { Chip } from '@mui/material';

const CounterChip = ({ counter, projectId }) => {
  const getChipForDays = (days, key) => {
    const label = `${days} dias`;
    let hexColor;

    if (days < 1) {
      hexColor = "#cccccc";
    } else if (days >= 30) {
      hexColor = "#FF0000";
    } else {
      const ratio = (days - 1) / (30 - 1);
      const r = Math.round(ratio * 255);
      const g = Math.round((1 - ratio) * 255);
      hexColor = "#" + [r, g, 0]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    }

    return (
      <Chip
        key={key}
        label={label}
        style={{ backgroundColor: hexColor, color: "#fff" }}
        variant="filled"
      />
    );
  };

  if (counter && typeof counter === "object") {
    if (projectId) {
      const days = counter[projectId];
      return days !== undefined ? getChipForDays(days, projectId) : null;
    }
    return (
      <>
        {Object.entries(counter).map(([id, days]) => getChipForDays(days, id))}
      </>
    );
  } else {
    return getChipForDays(counter, 'single-chip');
  }
};

export default CounterChip;
