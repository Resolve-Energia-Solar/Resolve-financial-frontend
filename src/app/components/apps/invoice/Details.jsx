import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TableSkeleton from "../comercial/sale/components/TableSkeleton";
import paymentService from "@/services/paymentService";
import Attachments from '@/app/components/shared/Attachments';
import SaleEditForm from "./components/accordeon-components/SaleEditForm";
import PaymentCard from "./components/paymentList/card";
import documentTypeService from "@/services/documentTypeService";
import Comment from "../comment";
import History from "../history";

const CONTEXT_TYPE_SALE_ID = process.env.NEXT_PUBLIC_CONTENT_TYPE_SALE_ID;

export default function Details({ id, refresh }) {
  const [documentTypes, setDocumentTypes] = useState([]);

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

  return (
    <Box>
      {/* Accordion - Informações da Venda */}
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: "80px",
            "& .MuiAccordionSummary-content": { margin: "12px 0" },
          }}
        >
          <InfoOutlinedIcon sx={{ marginRight: "8px" }} />
          <Typography variant="h6">Informações da Venda</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="body1">
            <SaleEditForm id_sale={id} />
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion - Documentos da Venda */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: "80px",
            "& .MuiAccordionSummary-content": { margin: "12px 0" },
          }}
        >
          <InfoOutlinedIcon sx={{ marginRight: "8px" }} />
          <Typography variant="h6">Documentos da Venda</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="body1">
            <Attachments
              contentType={CONTEXT_TYPE_SALE_ID}
              objectId={id}
              documentTypes={documentTypes}
            />
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion - Informações do Pagamento */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: "80px",
            "& .MuiAccordionSummary-content": { margin: "12px 0" },
          }}
        >
          <InfoOutlinedIcon sx={{ marginRight: "8px" }} />
          <Typography variant="h6">Informações do Pagamento</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="body1">
            <PaymentCard sale={id} />
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion - Comentários */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: "80px",
            "& .MuiAccordionSummary-content": { margin: "12px 0" },
          }}
        >
          <InfoOutlinedIcon sx={{ marginRight: "8px" }} />
          <Typography variant="h6">Comentários</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="body1">
            <Comment appLabel={"contracts"} objectId={id} model={"sale"} />
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion - Histórico */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            minHeight: "80px",
            "& .MuiAccordionSummary-content": { margin: "12px 0" },
          }}
        >
          <InfoOutlinedIcon sx={{ marginRight: "8px" }} />
          <Typography variant="h6">Histórico</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="body1">
            <History objectId={id} contentType={CONTEXT_TYPE_SALE_ID} />
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
