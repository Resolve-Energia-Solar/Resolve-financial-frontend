import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CommentIcon from "@mui/icons-material/Comment";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import DescriptionIcon from "@mui/icons-material/Description";
import Attachments from "@/app/components/shared/Attachments";
import SaleEditForm from "./components/accordeon-components/SaleEditForm";
import PaymentCard from "./components/paymentList/card";
import documentTypeService from "@/services/documentTypeService";
import Comment from "../comment";
import History from "../history";

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

export default function Details({ id, refresh }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [expandedPanels, setExpandedPanels] = useState([]); // <- agora é um array
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await documentTypeService.index({
          app_label__in: "contracts",
          limit: 30,
        });
        setDocumentTypes(response.results);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchData();
  }, []);

  const togglePanel = (key) => {
    setExpandedPanels((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const panels = [
    {
      key: "sale-info",
      icon: <InfoOutlinedIcon />,
      title: "Informações da Venda",
      content: <SaleEditForm id_sale={id} />,
    },
    {
      key: "documents",
      icon: <DescriptionIcon />,
      title: "Documentos da Venda",
      content: (
        <Attachments
          contentType={CONTEXT_TYPE_SALE_ID}
          objectId={id}
          documentTypes={documentTypes}
        />
      ),
      summaryRight: `${documentTypes.length} tipos`,
    },
    {
      key: "payment",
      icon: <PaymentIcon />,
      title: "Informações do Pagamento",
      content: <PaymentCard sale={id} />,
    },
    {
      key: "comments",
      icon: <CommentIcon />,
      title: "Comentários",
      content: <Comment appLabel={"resolve_crm"} objectId={id} model={"sale"} />,
    },
    {
      key: "history",
      icon: <HistoryIcon />,
      title: "Histórico",
      content: (
        <History objectId={id} contentType={CONTEXT_TYPE_SALE_ID} />
      ),
    },
  ];

  return (
    <Box>
      {panels.map(({ key, icon, title, content, summaryRight }) => {
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
              border: "1px solid #ddd",
              backgroundColor: theme.palette.background.paper,
            }}
            id={`accordion-${key}`}
            aria-controls={`accordion-${key}-content`}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: "80px",
                "& .MuiAccordionSummary-content": {
                  margin: "12px 0",
                  alignItems: "center",
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
              {summaryRight && (
                <Typography variant="body2" color="text.secondary">
                  {summaryRight}
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <Typography variant="body1">{content}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
