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

const mockSubmissions = [
  {
    id: 1,
    documentName: 'Contrato de Serviço',
    status: 'Pendente',
    events: [
      {
        timestamp: '22 Ago 2023 10:48:43',
        event: 'Processo de assinatura finalizado automaticamente.',
        details:
          'Motivo: finalização automática após a última assinatura habilitada. Processo de assinatura concluído para o documento número 8cac106a-9654-4148-9e81-f3090af270ba.',
        feedbackColor: 'green',
      },
      {
        timestamp: '22 Ago 2023 10:48:43',
        event: 'VANESSA SALES DA SILVA assinou para aprovar.',
        details:
          'Pontos de autenticação: Token via E-mail vanssilva28@hotmail.com. CPF informado: 696.240.032-20. Foto do documento oficial, sendo a frente com hash SHA256 prefixo 68f611(...), e o verso com hash SHA256 prefixo e098a1(...).',
        feedbackColor: 'blue',
      },
      {
        timestamp: '22 Ago 2023 10:36:50',
        event: 'Operador adicionou à Lista de Assinatura.',
        details:
          'Operador com email jonathan.resolvesolar@gmail.com na Conta 9bd3b2ee-ecaa-4381-a45c-beca533cab2f adicionou à Lista de Assinatura: vanssilva28@hotmail.com.',
        feedbackColor: 'orange',
      },
      {
        timestamp: '22 Ago 2023 10:32:59',
        event: 'Documento criado pelo operador.',
        details:
          'Operador com email jonathan.resolvesolar@gmail.com na Conta 9bd3b2ee-ecaa-4381-a45c-beca533cab2f criou o documento número 8cac106a-9654-4148-9e81-f3090af270ba. Data limite para assinatura do documento: 23 de agosto de 2023 (23:00). Finalização automática após a última assinatura habilitada.',
        feedbackColor: 'orange',
      },
    ],
  },
];

const EventItem = ({ event, isLast }) => (
  <TimelineItem>
    <TimelineOppositeContent
      sx={{ flex: 0.25, textAlign: 'right', pr: 2 }}
      color="textSecondary"
    >
      <Typography variant="body2" sx={{ fontSize: '13px' }}>
        {event.timestamp}
      </Typography>
    </TimelineOppositeContent>
    <TimelineSeparator>
      <TimelineDot sx={{ backgroundColor: event.feedbackColor }} />
      {!isLast && <TimelineConnector sx={{ backgroundColor: '#D3D3D3' }} />}
    </TimelineSeparator>
    <TimelineContent sx={{ pl: 2 }}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 'bold', fontSize: '15px', color: '#333' }}
        >
          {event.event}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: '13px', color: '#555', mt: 0.5 }}
        >
          {event.details}
        </Typography>
      </motion.div>
    </TimelineContent>
  </TimelineItem>
);

const ClicksignLogsPage = () => {
  const [submissions] = useState(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const handleOpenDetails = (submission) => setSelectedSubmission(submission);
  const handleCloseDetails = () => setSelectedSubmission(null);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Histórico de Eventos
      </Typography>

      <Grid container spacing={2}>
        {submissions.map((submission) => (
          <Grid item xs={12} sm={6} md={4} key={submission.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{submission.documentName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Status: {submission.status}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenDetails(submission)}
                    sx={{ mt: 1 }}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedSubmission)}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Histórico de Eventos</DialogTitle>
        <DialogContent dividers>
          {selectedSubmission ? (
            <Timeline position="right">
              {selectedSubmission.events.map((event, index) => (
                <EventItem
                  key={index}
                  event={event}
                  isLast={index === selectedSubmission.events.length - 1}
                />
              ))}
            </Timeline>
          ) : (
            <Typography>Nenhum evento disponível.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClicksignLogsPage;
