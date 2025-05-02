'use client';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Tooltip,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import CommentIcon from '@mui/icons-material/Comment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import EditProjectTab from '@/app/components/apps/project/Edit-project/tabs/EditProject';
import CheckListRateio from '@/app/components/apps/checklist/Checklist-list';
import Attachments from '@/app/components/shared/Attachments';
import AttachmentDetails from '@/app/components/shared/AttachmentDetails';
import RequestList from '../Request-list';
import UploadDocument from '../../project/UploadDocument';
import History from '@/app/components/apps/history';
import ListInspection from '../../project/components/SchedulesInspections/list-Inspections';
import Comment from '../../comment';
import useDocumentTypesByFilter from '@/hooks/document-types/useDocumenTypeByFilter';
import InspectionsTab from '../../project/Costumer-journey/Project-Detail/Inspections/InspectionsTab';
import InstallationsTab from '../../project/Costumer-journey/Project-Detail/installations/InstallationsTab';
import CommentsTab from '../../project/Costumer-journey/Project-Detail/Comments/CommentsTab';
import LogisticsTab from '../../project/Costumer-journey/Project-Detail/logistics/LogisticsTab';

const CONTENT_TYPE_PROJECT_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_PROJECT_ID;
const CONTENT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

export default function LogisticEditProject({ projectData, projectId }) {
  const theme = useTheme();
  const { documentTypes } = useDocumentTypesByFilter({ app_label__in: 'engineering' });
  const [expandedPanels, setExpandedPanels] = useState(['solicitacoes']);

  const togglePanel = (key) => {
    setExpandedPanels((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const panels = [
    {
      key: 'logistica',
      icon: <VisibilityOutlinedIcon />,
      title: 'Logística',
      content: (
        <Box mt={2}>
          <LogisticsTab projectId={projectId} />
        </Box>
      ),
    },
    {
      key: 'vistoria',
      icon: <VisibilityOutlinedIcon />,
      title: 'Vistoria',
      content: (
        <Box mt={2}>
          <InspectionsTab projectId={projectId} />
        </Box>
      ),
    },
    {
      key: 'instalacao',
      icon: <VisibilityOutlinedIcon />,
      title: 'Instalação',
      content: (
        <Box mt={2}>
          <InstallationsTab projectId={projectId} />
        </Box>
      ),
    },
    {
      key: 'engenharia',
      icon: <CheckCircleOutlineIcon />,
      title: 'Engenharia',
      content: (
        <Box mt={2}>
          <EditProjectTab projectId={projectId} />
          <UploadDocument projectId={projectId} />
          <CheckListRateio projectId={projectId} />
        </Box>
      ),
    },
    {
      key: 'homologacao',
      icon: <RequestPageIcon />,
      title: 'Homologação',
      content: (
        <Box mt={2}>
          <RequestList projectId={projectId} enableFilters={false} enableIndicators={false} />
        </Box>
      ),
    },
    // {
    //   key: 'Financeiro',
    //   icon: <InfoOutlinedIcon />,
    //   title: 'Financeiro',
    //   content: (
    //     <Box mt={2}>
    //       <PaymentCard sale={project?.sale} />
    //     </Box>
    //   ),
    // },
    {
      key: 'anexos',
      icon: <AttachFileIcon />,
      title: 'Anexos',
      content: (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            Anexos do Projeto
          </Typography>
          <Attachments
            contentType={CONTENT_TYPE_PROJECT_ID}
            objectId={projectId}
            documentTypes={documentTypes}
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Anexos da Venda
          </Typography>
          <AttachmentDetails
            contentType={CONTENT_TYPE_SALE_ID}
            objectId={projectData?.sale?.id}
            documentTypes={documentTypes}
          />
        </>
      ),
    },
    // {
    //   key: 'lista-de-materiais',
    //   icon: <ListAltIcon />,
    //   title: 'Lista de materiais',
    //   content: (
    //     <Box mt={2}>
    //       <UploadDocument projectId={projectId} project={projectData} />
    //     </Box>
    //   ),
    // },
    {
      key: 'historico',
      icon: <HistoryIcon />,
      title: 'Histórico',
      content: (
        <Box mt={2}>
          <History contentType={CONTENT_TYPE_PROJECT_ID} objectId={projectId} />
        </Box>
      ),
    },
    {
      key: 'comentarios-da-venda',
      icon: <CommentIcon />,
      title: 'Comentários da Venda',
      content: (
        <Box mt={2}>
          <CommentsTab projectId={projectId} />
        </Box>
      ),
    },
    {
      key: 'comentarios-do-projeto',
      icon: <ChatBubbleOutlineIcon />,
      title: 'Comentários do Projeto',
      content: (
        <Box mt={2}>
          <Comment
            appLabel="resolve_crm"
            model="project"
            objectId={projectId}
            label="Comentários do Projeto"
          />
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {panels.map(({ key, icon, title, content }) => {
        const isExpanded = expandedPanels.includes(key);
        return (
          <Accordion
            key={key}
            expanded={isExpanded}
            onChange={() => togglePanel(key)}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: 1,
              border: '1px solid #ddd',
              backgroundColor: theme.palette.background.paper,
            }}
            id={`accordion-${key}`}
            aria-controls={`accordion-${key}-content`}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: '80px',
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  alignItems: 'center',
                },
              }}
            >
              <Tooltip title={title}>
                <Box component="span" sx={{ mr: 1 }}>
                  {icon}
                </Box>
              </Tooltip>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                {title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              {content}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
