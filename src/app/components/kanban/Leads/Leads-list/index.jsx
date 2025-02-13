import React, { useState, useEffect, useContext } from 'react';
import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Chip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import projectService from '@/services/projectService';
import StatusChip from '@/utils/status/ProjectStatusChip';
import DocumentStatusChip from '@/utils/status/DocumentStatusIcon';
import { ProjectDataContext } from '@/app/context/ProjectContext';
import TableSkeleton from '@/app/components/apps/comercial/sale/components/TableSkeleton';
import ChipProject from '@/app/components/apps/project/components/ChipProject';
import leadService from '@/services/leadService';

const LeadList = ({ onClick }) => {
  // Estados para os dados e loading dos projetos
  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Estados para os indicadores
  const [indicators, setIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState(true);

  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";

    // Remover caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "");

    // Verificar se o número tem o tamanho esperado
    if (cleaned.length < 10 || cleaned.length > 11) return phone; // Retorna como está se não for válido

    // Adicionar código do país (Brasil +55 como exemplo)
    const countryCode = "+55";

    // Extrair DDD e número
    const ddd = cleaned.slice(0, 2);
    const firstPart = cleaned.length === 10 ? cleaned.slice(2, 6) : cleaned.slice(2, 7);
    const secondPart = cleaned.length === 10 ? cleaned.slice(6) : cleaned.slice(7);

    return `${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
  };

  // Outros estados
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();
  const { filters, setFilters, refresh } = useContext(ProjectDataContext);

  useEffect(() => {
    // Função para buscar os projetos
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const data = await leadService.getLeads({
          page: page + 1,
          limit: rowsPerPage,
        });
        setProjectsList(data.results);
        setTotalRows(data.count);
      } catch (err) {
        setError('Erro ao carregar Projetos');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();

  }, [page, rowsPerPage, filters, refresh]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end' }}>
        <Box>
          {/* Exemplo: Botão para criar projeto */}
          <Button
            startIcon={<Add />}
            // onClick={() => router.push('/apps/lead/create')}
            sx={{
              width: 74,
              height: 28,
              fontSize: '0.75rem',
              padding: '4px 8px',
              minWidth: 'unset',
              borderRadius: '4px',
              marginBottom: 2,
              backgroundColor: '#FFCC00',
              color: '#000',
              '&:hover': {
                backgroundColor: '#FFB800',
                color: '#000',
              },
            }}
          >
            Criar
          </Button>
        </Box>

      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>CPF/CNPJ</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Origem</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>KwH</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Endereço</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Fone</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          {loadingProjects ? (
            <TableSkeleton rows={rowsPerPage} cols={7} />
          ) : error && page === 1 ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableBody>
              {projectsList.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => onClick(item)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(236, 242, 255, 0.35)',
                    },
                  }}
                >
                  <TableCell sx={{fontWeight: "600", color: "#7E8388"}}>{item?.name}</TableCell>
                  <TableCell sx={{color: "#7E8388"}}>{item.first_document || '-'}</TableCell>
                  <TableCell sx={{color: "#7E8388"}}>{item?.origin?.name || '-'}</TableCell>
                  <TableCell sx={{color: "#7E8388"}}>{item?.kwp || '-'}</TableCell>
                  <TableCell sx={{color: "#7E8388"}}>{item?.addresses[0]?.street || '-'}, {item?.addresses[0]?.number || '-'} - {item?.addresses[0]?.city || '-'}</TableCell>
                  <TableCell sx={{color: "#7E8388"}}>{formatPhoneNumber(item?.phone)}</TableCell>
                  <TableCell>
                    <Chip
                      label={item?.column?.name || '-'}
                      sx={{
                        border: `1px solid ${item?.column?.color || 'transparent'}`,
                        backgroundColor: 'transparent',
                        color: "#7E8388"
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Linhas por página"
        />
      </TableContainer>
    </>
  );
};

export default LeadList;
