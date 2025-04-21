import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { timelineItemClasses } from '@mui/lab/TimelineItem';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

export default function CardAgentRoutes({ title, items = [] }) {
  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardHeader title={title} sx={{ pb: 0 }} />
      <CardContent>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {items.map((item, index) => {
            // Sempre usa o ícone de carro
            const IconComponent = <DirectionsCarIcon fontSize="small" />;
            return (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    {IconComponent}
                  </TimelineDot>
                  {index < items.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '8px', px: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.timestamp}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
}
