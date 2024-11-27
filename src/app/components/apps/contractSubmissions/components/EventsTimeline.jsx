import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { Upload, PersonAdd } from '@mui/icons-material';

const EventsTimeline = ({ events }) => {
  const getIcon = (eventName) => {
    switch (eventName) {
      case 'add_signer':
        return <PersonAdd color="primary" />;
      case 'upload':
        return <Upload color="secondary" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')}`;
  };

  return (
    <Timeline position="alternate">
      {events.map((event, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align={index % 2 === 0 ? 'right' : 'left'}
            variant="body2"
            color="text.secondary"
          >
            {formatDate(event.occurred_at)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              {getIcon(event.name)}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              {event.name === 'add_signer' ? 'Adicionou Signatário' : 'Upload de Documento'}
            </Typography>
            {event.name === 'add_signer' && event.data.signers?.length > 0 && (
              <Typography>
                Signatário: {event.data.signers[0].name} ({event.data.signers[0].email})
              </Typography>
            )}
            {event.name === 'upload' && (
              <Typography>
                Prazo: {formatDate(event.data.deadline_at)}
              </Typography>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default EventsTimeline;
