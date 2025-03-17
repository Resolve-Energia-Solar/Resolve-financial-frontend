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
import { useSelector } from 'react-redux';

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
  const user = useSelector((state) => state.user?.user);

  const [rows, setRows] = useState([]);
  const [row, setRow] = useState();
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataManaging, setFormDataManaging] = useState({});
  const [openSideDrawerCreate, setOpenSideDrawerCreate] = useState();
  const [rFormData, setRFormData] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [disabledManaging, setDisabledManaging] = useState(true);
  const [customer, setCustomer] = useState();
  const [managingPartner, setManagingPartner] = useState();

  const payloadClear = {
    complete_name: '',
    email: '',
    first_document: '',
    person_type: '',
    gender: '',
    birth_date: '',
  };
  const handleAddAttachment = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (formData.person_type == 'PJ') {
        // Cria o registro e obtém o object_id
        const userResponse = await userService.upInsert(customer.id, {
          complete_name: formData.complete_name,
          email: formData.email,
          first_document: formData.first_document,
          person_type: formData.person_type,
          addresses: [320],
          user_types: [2],
        });

        setCustomer(userResponse);

        const userResponseManaging = await userService.upInsert(managingPartner.id, {
          complete_name: formDataManaging.complete_name,
          email: formDataManaging.email,
          first_document: formDataManaging.first_document,
          person_type: formDataManaging.person_type,
          birth_date: formDataManaging.birth_date,
          gender: formDataManaging.gender,
          addresses: [320],
          user_types: [2],
          user_types: [2],
        });

        setManagingPartner(userResponseManaging);
      } else {
        const userResponse = await userService.upInsert(customer.id, {
          complete_name: formData.complete_name,
          email: formData.email,
          first_document: formData.first_document,
          person_type: formData.person_type,
          gender: formData.gender,
          birth_date: formData.birth_date,
          addresses: [320],
          user_types: [2],
        });
        setCustomer(userResponse);
      }

      const recordResponse = await requestSicoob.create({
        occupation: formData.person_type == 'PJ' ? 'Empresa' : rFormData.occupation,
        monthly_income: rFormData.monthly_income,
        customer: customer?.id,
        managing_partner: managingPartner?.id,
        requested_by: user?.id,
      });
      const recordId = recordResponse.id;

      // Envia cada anexo pendente
      await Promise.all(
        attachments.map(async (attachment) => {
          const formDataAttachment = new FormData();
          formDataAttachment.append('file', attachment.file);
          formDataAttachment.append('description', attachment.description);
          formDataAttachment.append('object_id', recordId);
          formDataAttachment.append('content_type_id', 121);
          formDataAttachment.append('document_type_id', '');
          formDataAttachment.append('document_subtype_id', '');
          formDataAttachment.append('status', '');
          await attachmentService.createAttachment(formDataAttachment);
        }),
      );
      setOpenSideDrawerCreate(false);
      fetchRequestSicoob();
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

  const verifyUser = async (first_document) => {
    try {
      const response = await userService.index({
        first_document__icontains: first_document,
        fields: ['id', 'first_document', 'email', 'complete_name', 'gender', 'birth_date'],
      });

      return response.results;
    } catch (error) {
      enqueueSnackbar(`Erro ao buscar contate o suporte: ${error}`, { variant: 'error' });
      console.log(error);
    }
  };

  const itemSelected = (row) => {
    setRow(row);
    setOpenSideDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenSideDrawerCreate(false);
    setFormData(null);
    setFormDataManaging(null);
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;

    console.log(name, value);

    if (
      name === 'first_document' &&
      ((value.length == 11 && formData.person_type == 'PF') ||
        (value.length == 14 && formData.person_type == 'PJ'))
    ) {
      const user = await verifyUser(value);

      if (user.length == 0) {
        enqueueSnackbar('Nenhum registro encontrado com este CPF ou CNPJ. Complete o Cadastro', {
          variant: 'warning',
        });
        setDisabled(false);
      } else {
        setFormData((prevData) => ({ ...prevData, ...user[0] }));
        setCustomer(user[0]);
      }
    }

    if (name === 'person_type') {
      setFormData(payloadClear);
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeManaging = async (event) => {
    const { name, value } = event.target;
    if (name === 'first_document' && value.length == 11) {
      const user = await verifyUser(value);
      if (user.length == 0) {
        enqueueSnackbar('Nenhum registro encontrado com este CPF ou CNPJ. Complete o Cadastro', {
          variant: 'warning',
        });
        setDisabledManaging(false);
      } else {
        setFormDataManaging((prevData) => ({ ...prevData, ...user[0] }));
        setManagingPartner(user[0]);
      }
    }
    if (name === 'person_type') {
      setFormDataManaging(payloadClear);
    }
    setFormDataManaging((prevData) => ({ ...prevData, [name]: value }));
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
      <SideDrawer open={openSideDrawerCreate} onClose={onCloseDrawer} title="Detalhes">
        <>
          <CreateFundingRequest
            formData={formData}
            formDataManaging={formDataManaging}
            handleChange={handleChange}
            handleChangeManaging={handleChangeManaging}
            rFormData={rFormData}
            handleChangeRFormData={handleChangeRFormData}
            disabled={disabled}
            disabledManaging={disabledManaging}
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
