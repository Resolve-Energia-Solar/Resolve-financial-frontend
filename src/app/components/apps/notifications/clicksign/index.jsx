import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { motion } from 'framer-motion';
import { PendingActions, CheckCircle, Cancel } from '@mui/icons-material';

const mockSubmissions = [
  {
    id: 1,
    documentName: 'Contrato de Serviço',
    status: 'Pendente',
    icon: <PendingActions color="warning" />,
    events: [
      {
        timestamp: '22 Ago 2023 10:48:43',
        event: 'Processo de assinatura finalizado automaticamente.',
        details: 'Motivo: finalização automática após a última assinatura.',
        feedbackColor: 'green',
      },
      {
        timestamp: '22 Ago 2023 10:48:43',
        event: 'VANESSA SALES DA SILVA assinou para aprovar.',
        details: 'Autenticação via E-mail vanssilva28@hotmail.com.',
        feedbackColor: 'blue',
      },
    ],
  },
  {
    id: 2,
    documentName: 'Proposta Comercial',
    status: 'Aprovado',
    icon: <CheckCircle color="success" />,
    events: [
      {
        timestamp: '23 Ago 2023 09:15:12',
        event: 'Proposta aprovada pelo cliente.',
        details: 'Documento número 1234 aprovado.',
        feedbackColor: 'green',
      },
    ],
  },
  {
    id: 3,
    documentName: 'Acordo de Confidencialidade',
    status: 'Cancelado',
    icon: <Cancel color="error" />,
    events: [
      {
        timestamp: '24 Ago 2023 14:32:00',
        event: 'Processo de assinatura cancelado.',
        details: 'Cancelado pelo operador.',
        feedbackColor: 'red',
      },
    ],
  },
];

const EventItem = ({ event, isLast }) => (
  <TimelineItem>
    <TimelineOppositeContent sx={{ flex: 0.25, textAlign: 'right', pr: 2 }} color="textSecondary">
      <Typography variant="body2" sx={{ fontSize: '13px' }}>{event.timestamp}</Typography>
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot sx={{ backgroundColor: event.feedbackColor }} />
      {!isLast && <TimelineConnector sx={{ backgroundColor: '#D3D3D3' }} />}
    </TimelineSeparator>
    <TimelineContent sx={{ pl: 2 }}>
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}>
          {event.event}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '13px', color: '#555', mt: 0.5 }}>{event.details}</Typography>
      </motion.div>
    </TimelineContent>
  </TimelineItem>
);

const HistoryOfSubmissions = () => {
  const [submissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleOpenDetails = (submission) => setSelectedSubmission(submission);
  const handleCloseDetails = () => setSelectedSubmission(null);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Histórico de Envios
      </Typography>

      <Grid container spacing={3}>
        {submissions.map((submission) => (
          <Grid item xs={12} sm={6} md={4} key={submission.id}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card sx={{ position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6">{submission.documentName}</Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    Status: {submission.status}
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {submission.icon}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenDetails(submission)}
                      sx={{ mt: 1 }}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selectedSubmission)} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>Histórico de Envios</DialogTitle>
        <DialogContent dividers>
          {selectedSubmission ? (
            <Timeline position="right">
              {selectedSubmission.events.map((event, index) => (
                <EventItem key={index} event={event} isLast={index === selectedSubmission.events.length - 1} />
              ))}
            </Timeline>
          ) : (
            <Typography>Nenhum evento disponível.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="secondary">Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryOfSubmissions;
