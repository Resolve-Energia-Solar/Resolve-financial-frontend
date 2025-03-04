'use client';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Grid,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import AttachmentCard from '../components/CardAttachment';
import { useEffect, useState } from 'react';
import { useTheme } from '@emotion/react';
import attachmentService from '@/services/attachmentService';
import AddAttachmentModal from '../Leads-documents/AddAttachmentModal';

function LeadAttachmentsAccordion({ objectId, contentType, documentTypes, title }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const options_document_types = documentTypes.map((docType) => ({
        value: docType.id,
        label: docType.name,
    }));

    const statusDoc = [
        { value: 'EA', label: 'Em Análise', color: theme.palette.info.main },
        { value: 'A', label: 'Aprovado', color: theme.palette.success.main },
        { value: 'R', label: 'Reprovado', color: theme.palette.error.main },
    ];

    const handleSelectAttachment = (attachment) => {
        setSelectedAttachment(attachment);
        setOpenModal(true);
    };

    const handleClosedModal = () => {
        setSelectedAttachment(null);
        setOpenModal(false);
    };

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const response = await attachmentService.getAttachment(objectId, contentType);
                const fetchedAttachments = response.results;

                const pendingAttachments = documentTypes
                    .filter(docType => !fetchedAttachments.some(att => att.document_type.id === docType.id))
                    .map(docType => ({
                        id: `pending-${docType.id}`,
                        document_type: { name: `${docType.name}`, id: docType.id },
                        pending: true
                    }));

                setAttachments([...fetchedAttachments, ...pendingAttachments]);

                console.log('Attachments (including pending):', [...fetchedAttachments, ...pendingAttachments]);
            } catch (error) {
                console.error('Error fetching attachments:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [objectId, contentType, documentTypes, refresh]);

    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {title || 'Documentos'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            {loading ? (
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 400, color: '#092C4C', fontSize: '14px' }}
                                >
                                    Carregando...
                                </Typography>
                            ) : (
                                attachments.map((attachment) => (
                                    <Grid item xs={12} md={6} key={attachment.id}>
                                        <AttachmentCard filename={attachment.document_type.name} pending={attachment.pending} onClick={() => handleSelectAttachment(attachment)} onEdit={() => handleSelectAttachment(attachment)} />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 400, color: '#092C4C', cursor: 'pointer', fontSize: '14px' }}
                            onClick={() => handleSelectAttachment(null)}
                        >
                            + Anexar novo documento
                        </Typography>

                    </Box>
                </AccordionDetails>

            </Accordion>

            <AddAttachmentModal
                objectId={parseInt(objectId)}
                contentType={parseInt(contentType)}
                openModal={openModal}
                onCloseModal={handleClosedModal}
                selectedAttachment={selectedAttachment}
                options_document_types={options_document_types}
                onRefresh={handleRefresh}
            />
        </>
    );
}

export default LeadAttachmentsAccordion;