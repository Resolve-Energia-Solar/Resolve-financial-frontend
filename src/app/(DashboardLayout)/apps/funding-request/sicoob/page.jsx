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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  TablePagination,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import AttachmentDrawer from '../../attachment/AttachmentDrawer';
import attachmentService from '@/services/attachmentService';
import userService from '@/services/userService';
import { useSelector } from 'react-redux';
import { TabPanel } from '@/app/components/shared/TabPanel';
import Comment from '@/app/components/apps/comment';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Solicitações de Financiamento' },
];

export default function Sicoob() {
  const user = useSelector((state) => state.user?.user);

  const [rows, setRows] = useState([]);
  const [row, setRow] = useState();
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [openSideDrawerCreate, setOpenSideDrawerCreate] = useState(false);
  const [formData, setFormData] = useState({});
  const [formDataManaging, setFormDataManaging] = useState({});
  const [rFormData, setRFormData] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [disabledManaging, setDisabledManaging] = useState(true);
  const [customer, setCustomer] = useState();
  const [managingPartner, setManagingPartner] = useState();
  const [value, setValue] = useState(0);

  // paginação
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  const payloadClear = {
    complete_name: '',
    email: '',
    first_document: '',
    person_type: '',
    gender: '',
    birth_date: '',
  };

  // formata só com separador de milhares (exibição)
  const formatNumber = (value) => {
    const onlyDigits = value.replace(/\D/g, '');
    return onlyDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // converte string formatada para Number (envio)
  const parseNumber = (value) => {
    if (!value) return null;
    const normalized = value.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(normalized);
    return isNaN(num) ? null : num;
  };

  // busca lista com page e limit
  const fetchRequestSicoob = async () => {
    try {
      const res = await requestSicoob.index({
        page: page + 1,
        limit,
        expand: ['customer', 'managing_partner', 'requested_by.phone_numbers'],
        fields: [
          '*',
          'customer.complete_name',
          'customer.person_type',
          'customer.email',
          'customer.first_document',
          'customer.gender',
          'customer.birth_date',
          'managing_partner.complete_name',
          'managing_partner.person_type',
          'managing_partner.email',
          'managing_partner.first_document',
          'managing_partner.gender',
          'managing_partner.birth_date',
          'requested_by.complete_name',
          'requested_by.phone_numbers.area_code',
          'requested_by.phone_numbers.number',
        ],
        format: 'json',
      });
      setRows(res.results);
      setCount(res.meta.pagination.total_count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequestSicoob();
  }, [page, limit]);

  const handleAddAttachment = (attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  };

  const handleChangeTab = (_, newValue) => {
    setValue(newValue);
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    // busca usuário ao completar CPF/CNPJ
    if (
      name === 'first_document' &&
      ((value.length === 11 && formData.person_type === 'PF') ||
        (value.length === 14 && formData.person_type === 'PJ'))
    ) {
      const found = await userService
        .index({
          first_document__icontains: value,
          fields: [
            'id',
            'first_document',
            'complete_name',
            'email',
            'gender',
            'birth_date',
          ],
        })
        .then((res) => res.results);
      if (found.length === 0) {
        enqueueSnackbar(
          'Nenhum registro encontrado. Complete o cadastro.',
          { variant: 'warning' }
        );
        setDisabled(false);
      } else {
        setFormData((p) => ({ ...p, ...found[0] }));
        setCustomer(found[0]);
      }
    }
    if (name === 'person_type') {
      setFormData(payloadClear);
      setDisabled(false);
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleChangeManaging = async (e) => {
    const { name, value } = e.target;
    if (name === 'first_document' && value.length === 11) {
      const found = await userService
        .index({
          first_document__icontains: value,
          fields: [
            'id',
            'first_document',
            'complete_name',
            'email',
            'gender',
            'birth_date',
          ],
        })
        .then((res) => res.results);
      if (found.length === 0) {
        enqueueSnackbar(
          'Nenhum registro encontrado. Complete o cadastro.',
          { variant: 'warning' }
        );
        setDisabledManaging(false);
      } else {
        setFormDataManaging((p) => ({ ...p, ...found[0] }));
        setManagingPartner(found[0]);
      }
    }
    if (name === 'person_type') {
      setFormDataManaging(payloadClear);
      setDisabledManaging(false);
    }
    setFormDataManaging((p) => ({ ...p, [name]: value }));
  };

  const handleChangeRFormData = (e) => {
    const { name, value } = e.target;
    if (name === 'monthly_income' || name === 'project_value') {
      setRFormData((p) => ({ ...p, [name]: formatNumber(value) }));
    } else {
      setRFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. cria/atualiza customer
      const custBody = {
        complete_name: formData.complete_name,
        email: formData.email,
        first_document: formData.first_document,
        person_type: formData.person_type,
        ...(formData.person_type === 'PF' && {
          gender: formData.gender,
          birth_date: formData.birth_date,
        }),
        user_types: [2],
      };
      const newCustomer = await userService.upInsert(
        formData.id ?? null,
        custBody
      );
      setCustomer(newCustomer);

      // 2. cria/atualiza managing partner (PJ)
      let newManaging = null;
      if (formData.person_type === 'PJ') {
        const mpBody = {
          complete_name: formDataManaging.complete_name,
          email: formDataManaging.email,
          first_document: formDataManaging.first_document,
          person_type: formDataManaging.person_type,
          gender: formDataManaging.gender,
          birth_date: formDataManaging.birth_date,
          user_types: [2],
        };
        newManaging = await userService.upInsert(
          formDataManaging.id ?? null,
          mpBody
        );
        setManagingPartner(newManaging);
      }

      // 3. monta payload e converte valores numéricos
      const payload = {
        occupation:
          formData.person_type === 'PJ'
            ? 'Empresa'
            : rFormData.occupation,
        monthly_income: parseNumber(rFormData.monthly_income),
        project_value: parseNumber(rFormData.project_value),
        customer: newCustomer.id,
        managing_partner: newManaging?.id ?? null,
        requested_by: user.id,
      };
      if (payload.project_value == null) {
        enqueueSnackbar('Valor do projeto inválido.', {
          variant: 'error',
        });
        setLoading(false);
        return;
      }

      // 4. cria a solicitação
      const { id: recordId } = await requestSicoob.create(payload);

      // 5. envia anexos
      await Promise.all(
        attachments.map(({ file, description }) => {
          const fd = new FormData();
          fd.append('file', file);
          fd.append('description', description);
          fd.append('object_id', recordId);
          fd.append('content_type', 121);
          fd.append('document_type', '');
          fd.append('document_subtype', '');
          fd.append('status', '');
          return attachmentService.create(fd);
        })
      );

      setOpenSideDrawerCreate(false);
      fetchRequestSicoob();
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setFormErrors(err.response.data);
        Object.entries(err.response.data).forEach(([field, msgs]) => {
          enqueueSnackbar(
            `Erro no campo ${field}: ${msgs.join(', ')}`,
            { variant: 'error' }
          );
        });
      } else {
        enqueueSnackbar(`Erro ao salvar: ${err.message}`, {
          variant: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (status, id) => {
    try {
      await requestSicoob.update(id, { status });
      fetchRequestSicoob();
      enqueueSnackbar('Salvo com sucesso', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(`Erro ao salvar: ${err}`, {
        variant: 'error',
      });
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

  const itemSelected = (r) => {
    setRow(r);
    setOpenSideDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenSideDrawerCreate(false);
    setFormData({});
    setFormDataManaging({});
    setRFormData({});
    setAttachments([]);
    setDisabled(true);
    setDisabledManaging(true);
  };

  return (
    <Box>
      <Breadcrumb items={BCrumb} />

      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button onClick={() => setOpenSideDrawerCreate(true)}>
          Nova Solicitação
        </Button>
      </Box>

      <BlankCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Contratante</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Natureza</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Sócio Adm.</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  onClick={() => itemSelected(r)}
                >
                  <TableCell>
                    {r.customer.complete_name}
                  </TableCell>
                  <TableCell>
                    {r.customer.person_type}
                  </TableCell>
                  <TableCell>
                    {r.managing_partner?.complete_name}
                  </TableCell>
                  <TableCell>{getStatus(r.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </BlankCard>

      {/* Detalhes / Comentários */}
      <SideDrawer
        open={openSideDrawer}
        onClose={() => setOpenSideDrawer(false)}
        title="Detalhes"
      >
        {row && (
          <>
            <Tabs
              value={value}
              onChange={handleChangeTab}
            >
              <Tab label="Solicitação" value={0} />
              <Tab label="Comentários" value={1} />
            </Tabs>

            <TabPanel value={value} index={0}>
              <DetailsFundingRequest
                data={row}
                handleChangeStatus={handleChangeStatus}
              />
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Comment
                appLabel="contracts"
                model="sicoobrequest"
                objectId={row.id}
              />
            </TabPanel>
          </>
        )}
      </SideDrawer>

      {/* Criar nova solicitação */}
      <SideDrawer
        open={openSideDrawerCreate}
        onClose={onCloseDrawer}
        title="Nova Solicitação"
      >
        <CreateFundingRequest
          formData={formData}
          formDataManaging={formDataManaging}
          rFormData={rFormData}
          handleChange={handleChange}
          handleChangeManaging={handleChangeManaging}
          handleChangeRFormData={handleChangeRFormData}
          disabled={disabled}
          disabledManaging={disabledManaging}
        >
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            mt={2}
          >
            <AttachmentDrawer
              objectId={null}
              attachments={attachments}
              onAddAttachment={handleAddAttachment}
              appLabel="contracts"
              model="sicoobrequest"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Criar'
              )}
            </Button>
          </Stack>
        </CreateFundingRequest>
      </SideDrawer>
    </Box>
  );
}
