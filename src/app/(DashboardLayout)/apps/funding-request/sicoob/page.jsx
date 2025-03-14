'use client';

import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import CreateFundingRequest from '@/app/components/apps/funding-request/CreateFundingRequest';
import DetailsFundingRequest from '@/app/components/apps/funding-request/DetailsFundingRequest';

import BlankCard from '@/app/components/shared/BlankCard';
import SideDrawer from '@/app/components/shared/SideDrawer';
import requestSicoob from '@/services/requestSicoobService';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import AttachmentDrawer from '../../attachment/AttachmentDrawer';
import attachmentService from '@/services/attachmentService';
import userService from '@/services/userService';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Solicitações de Financiamento',
  },
];

export default function Sicoob() {
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState();
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataManaging, setFormDataManaging] = useState({});
  const [openSideDrawerCreate, setOpenSideDrawerCreate] = useState();
  const [rFormData, setRFormData] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleAddAttachment = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    let managing_partner;
    let customer;
    try {
      if (formData.person_type == 'PJ') {
        // Cria o registro e obtém o object_id
        const userResponse = await userService.createUser({
          complete_name: formData.complete_name,
          email: formData.email,
          first_document: formData.first_document,
          person_type: formData.person_type,
          addresses: [3582],
          user_types: [2],
        });

        customer = userResponse.id;

        const userResponseManaging = await userService.createUser({
          complete_name: formDataManaging.complete_name,
          email: formDataManaging.email,
          first_document: formDataManaging.first_document,
          person_type: formDataManaging.person_type,
          birth_date: formDataManaging.birth_date,
          gender: formDataManaging.gender,
          addresses: [3582],
          user_types: [2],
          user_types: [2],
        });

        managing_partner = userResponseManaging.id;
      } else {
        const userResponse = await userService.createUser({
          complete_name: formData.complete_name,
          email: formData.email,
          first_document: formData.first_document,
          person_type: formData.person_type,
          gender: formData.gender,
          birth_date: formData.birth_date,
          addresses: [3582],
          user_types: [2],
        });
        customer = userResponse.id;
      }

      const recordResponse = await requestSicoob.create({
        occupation: rFormData.occupation,
        monthly_income: rFormData.monthly_income,
        customer: customer,
        managing_partner: managing_partner,
      });
      const recordId = recordResponse.id;
      // Envia cada anexo pendente
      await Promise.all(
        attachments.map(async (attachment) => {
          const formDataAttachment = new FormData();
          formDataAttachment.append('file', attachment.file);
          formDataAttachment.append('description', attachment.description);
          formDataAttachment.append('object_id', recordId);
          formDataAttachment.append('content_type_id', contentTypeId);
          formDataAttachment.append('document_type_id', '');
          formDataAttachment.append('document_subtype_id', '');
          formDataAttachment.append('status', '');
          await attachmentService.createAttachment(formDataAttachment);
        }),
      );
      router.push('/apps/funding-request/sicoob');
    } catch (error) {
      console.error('Erro ao salvar registro ou anexos:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        setFormErrors(errors);
        Object.keys(errors).forEach((field) => {
          const label = fieldLabels[field] || field;
          enqueueSnackbar(`Erro no campo ${label}: ${errors[field].join(', ')}`, {
            variant: 'error',
          });
        });
      } else {
        enqueueSnackbar('Erro ao salvar registro ou anexos: ' + error.message, {
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequestSicoob();
  }, []);

  const fetchRequestSicoob = async () => {
    try {
      const response = await requestSicoob.index({
        expand: ['customer', 'managing_partner'],
        fields: [
          '*',
          'customer.complete_name',
          'customer.person_type',
          'customer.email',
          'customer.first_document',
          'customer.gender',
          'customer.birth_date',
          'managing_partner.complete_name',
        ],
        format: 'json',
      });

      setRows(response.results);
    } catch (error) {
      console.log(error);
    }
  };

  const itemSelected = (row) => {
    setRow(row);
    setOpenSideDrawer(true);
  };

  const handleChange = (event) => {
    setFormData((prevData) => ({ ...prevData, [event.target.name]: event.target.value }));
  };

  const handleChangeManaging = (event) => {
    setFormDataManaging((prevData) => ({ ...prevData, [event.target.name]: event.target.value }));
  };

  const handleChangeRFormData = (event) => {
    setRFormData((prevData) => ({ ...prevData, [event.target.name]: event.target.value }));
  };

  const handleChangeStatus = async (status, id) => {
    try {
      const response = await requestSicoob.update(id, {
        status,
      });

      fetchRequestSicoob();
      enqueueSnackbar(`Salvo com sucesso`, { variant: 'success' });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(`Erro ao salvar contate o suporte: ${error}`, { variant: 'error' });
    }
  };

  const handleSave = async () => {};
  const getStatus = (status) => {
    switch (status) {
      case 'A':
        return <Chip label="Aprovado" color="success" />;
      case 'P':
        return <Chip label="Em análise" color="warning" />;
      case 'R':
        return <Chip label="Reprovado" color="error" />;
      case 'PA':
        return <Chip label="Pré-Aprovado" color="success" />;
      default:
        return <Chip label="Pendente" color="warning" />;
    }
  };
  return (
    <Box>
      <Breadcrumb items={BCrumb} />
      <Box
        sx={{
          padding: '22px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Button onClick={() => setOpenSideDrawerCreate(true)}>Nova Solicitação</Button>
      </Box>
      <BlankCard>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Contratante</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Natureza</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Sócio Administrador</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} onClick={() => itemSelected(row)}>
                  <TableCell>{row.customer.complete_name}</TableCell>
                  <TableCell>{row.customer.person_type}</TableCell>
                  <TableCell>{row.customer.complete_name}</TableCell>
                  <TableCell>{getStatus(row.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BlankCard>
      <SideDrawer open={openSideDrawer} onClose={() => setOpenSideDrawer(false)} title="Detalhes">
        {row && <DetailsFundingRequest data={row} handleChangeStatus={handleChangeStatus} />}
      </SideDrawer>
      <SideDrawer
        open={openSideDrawerCreate}
        onClose={() => setOpenSideDrawerCreate(false)}
        title="Detalhes"
      >
        <>
          <CreateFundingRequest
            formData={formData}
            formDataManaging={formDataManaging}
            handleSave={handleSave}
            handleChange={handleChange}
            handleChangeManaging={handleChangeManaging}
            rFormData={rFormData}
            handleChangeRFormData={handleChangeRFormData}
          >
            <Stack direction="row" spacing={2} justifyContent="space-between" mt={2}>
              <AttachmentDrawer
                objectId={null}
                attachments={attachments}
                onAddAttachment={handleAddAttachment}
                appLabel={'contracts'}
                model={'sicoobrequest'}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Criar'}
              </Button>
            </Stack>
          </CreateFundingRequest>
        </>
      </SideDrawer>
    </Box>
  );
}
