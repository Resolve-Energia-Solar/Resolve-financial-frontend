import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Card, CardContent, CardHeader, Typography, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { timelineItemClasses } from '@mui/lab/TimelineItem';

import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { Add, MoreVert } from '@mui/icons-material';
import ModalChooseOption from '@/app/components/apps/inspections/schedule/AgentRoutes/components/ModalChooseOption';

export default function CardAgentRoutes({ id, date, title, items = [], onItemClick, onCreateSchedule, onListSchedule, onOpenMap }) {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const isDateTodayOrLater = (date) => {
    const today = new Date();
    const givenDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    return givenDate >= today;
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenMap = () => {
    const locations = items
      .filter(item => item?.address?.latitude && item?.address?.longitude)
      .map(item => ({
        lat: parseFloat(item?.address?.latitude),
        lng: parseFloat(item?.address?.longitude),
      }));

    if (locations.length > 0) {
      onOpenMap(locations);
    }
    handleMenuClose();
  };

  // Verifica se há pelo menos um item com latitude e longitude
  const hasLocations = items.some(item => item?.address?.latitude && item?.address?.longitude);

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title={<Typography variant="h6" sx={{ fontSize: '0.995rem' }}>{title}</Typography>}
        sx={{ pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        action={
          <IconButton onClick={handleMenuClick} size="small">
            <MoreVert />
          </IconButton>
        }
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        >
          <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
          Horário disponível: 08:00 - 18:00
        </Typography>

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

        {isDateTodayOrLater(date) && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button onClick={() => setOpenModal(true)} startIcon={<Add />}>
              Agendar Vistoria
            </Button>
          </Box>
        )}
      </CardContent>

      <ModalChooseOption
        open={openModal}
        onClose={() => setOpenModal(false)}
        onChoose={(option) => {
          setOpenModal(false);
          if (option === 'create') {
            onCreateSchedule(id);
          } else if (option === 'list') {
            onListSchedule(id);
          }
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={handleOpenMap}
          disabled={!hasLocations}
        >
          Abrir o mapa
        </MenuItem>
      </Menu>
    </Card>
  );
}