import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Card, CardContent, CardHeader, Typography, Button, Box } from '@mui/material';
import { timelineItemClasses } from '@mui/lab/TimelineItem';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { Add } from '@mui/icons-material';
import ModalChooseOption from '@/app/components/apps/inspections/schedule/AgentRoutes/components/ModalChooseOption';

export default function CardAgentRoutes({ id, title, items = [], onItemClick, onCreateSchedule, onListSchedule }) {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader title={title} sx={{ pb: 0 }} />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        >
          <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
          Horário disponível: 08:00 - 18:00
        </Typography>
        {/* <Typography
          variant="body2"
          fontWeight={500}
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <RoomIcon fontSize="small" color="error" sx={{ mr: 1 }} />
          Bloqueado: 15:00 - 18:00
        </Typography> */}
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {items.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const IconComponent = isHovered ? (
              <EditIcon fontSize="small" />
            ) : (
              <DirectionsCarIcon fontSize="small" />
            );
            return (
              <TimelineItem
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <TimelineSeparator>
                  <TimelineDot
                    color="primary"
                    onClick={() => onItemClick(item.id)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: isHovered ? 'lightgreen' : 'primary.main',
                    }}
                  >
                    {IconComponent}
                  </TimelineDot>
                  {index < items.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent
                  sx={{ py: '8px', px: 2, cursor: 'pointer' }}
                  onClick={() => onItemClick(item.id)}
                >
                  <Typography variant="body2" fontWeight={500}>
                    {item.schedule_date && item.schedule_date.split('T')[0].split('-').reverse().join('/')} <br /> {item.schedule_start_time?.substring(0, 5)} - {item.schedule_end_time?.substring(0, 5)}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {item.address.street}, {item.address.number}
                  </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {item.address.neighborhood && `${item.address.neighborhood}, `}
                      {item.address.city && `${item.address.city} - `}
                      {item.address.zip_code && item.address.zip_code.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
                    </Typography>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button onClick={() => setOpenModal(true)} startIcon={<Add />}>
            Agendar Vistoria
          </Button>
        </Box>
      </CardContent>
      <ModalChooseOption
        open={openModal}
        onClose={() => setOpenModal(false)}
        onChoose={(option) => {
          setOpenModal(false);
          if (option === 'create') {
            onCreateSchedule(id)
          } else if (option === 'list') {
            onListSchedule(id)
          }
        }} />
    </Card>
  );
}
