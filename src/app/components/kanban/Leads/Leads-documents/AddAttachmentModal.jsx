import FormSelect from "@/app/components/forms/form-custom/FormSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import HasPermission from "@/app/components/permissions/HasPermissions";
import useAttachmentForm from "@/hooks/attachments/useAttachmentsForm";
import { useTheme } from "@emotion/react";
import { Description, Image, PictureAsPdf, UploadFile } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Link, List, ListItem, Modal, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useSelector } from "react-redux";

function AddAttachmentModal({
    objectId,
    contentType,
    options_document_types,
    selectedAttachment,
    openModal,
    onCloseModal,
    onRefresh,
}) {
    const theme = useTheme();
    const [selectedFile, setSelectedFile] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const userPermissions = useSelector((state) => state.user.permissions);

    const statusDoc = [
        { value: 'EA', label: 'Em Análise', color: theme.palette.info.main },
        { value: 'A', label: 'Aprovado', color: theme.palette.success.main },
        { value: 'R', label: 'Reprovado', color: theme.palette.error.main },
    ];

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop();
        if (['pdf'].includes(extension)) return <PictureAsPdf />;
        if (['jpg', 'jpeg', 'png'].includes(extension)) return <Image />;
        return <Description />;
    };

    const {
        formData,
        clearForm,
        handleChange,
        handleSave,
        formErrors,
        setFormErrors,
        success,
        loading: formLoading,
        refreshSuccess,
    } = useAttachmentForm(
        selectedAttachment || null,
        selectedAttachment?.pending == true ? null : selectedAttachment?.id,
        selectedAttachment?.object_id || objectId,
        selectedAttachment?.document_type?.id || null,
        selectedAttachment?.content_type?.id || parseInt(contentType),
    );

    formData.document_type = formData.document_type ? formData.document_type : selectedAttachment?.document_type?.id || '';
    formData.object_id = formData.object_id ? formData.object_id : selectedAttachment?.object_id || objectId;
    formData.content_type = formData.content_type ? formData.content_type : selectedAttachment?.content_type?.id || parseInt(contentType);
    formData.status ? formData.status : (formData.status = 'EA');


    const handleCloseModal = () => {
        onCloseModal();
        setSelectedFile(null);
        setFormErrors({});
        clearForm();
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const timestamp = Date.now();
            const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
            const extension = file.name.split('.').pop();
            const uniqueFileName = `${fileNameWithoutExt}_${timestamp}.${extension}`;

            const renamedFile = new File([file], uniqueFileName, { type: file.type });

            setSelectedFile(renamedFile);
            handleChange('file', renamedFile);
        }
    };

    const handleSaveForm = async () => {
        const response = await handleSave();
        if (response) {
            enqueueSnackbar('Anexo salvo com sucesso', { variant: 'success' });
            if (onRefresh) onRefresh();
            if (onCloseModal) onCloseModal();
        }
    }

    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="file-upload-modal"
            aria-describedby="upload-your-file"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.primary.main}`,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography id="file-upload-modal" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                    Selecione seu arquivo
                </Typography>

                {formErrors.file && <Alert severity="error">{formErrors.file}</Alert>}

                <Box
                    sx={{
                        border: `2px dashed ${theme.palette.primary.main}`,
                        padding: 5,
                        textAlign: 'center',
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.default,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    <UploadFile
                        sx={{ fontSize: 50, marginBottom: 2, color: theme.palette.primary.main }}
                    />
                    <Typography>Clique para adicionar um arquivo</Typography>
                    <input type="file" id="file-upload" hidden onChange={handleFileSelect} />
                </Box>

                <FormSelect
                    label="Tipo de Documento"
                    options={options_document_types}
                    value={formData.document_type}
                    onChange={(e) => handleChange('document_type', e.target.value)}
                />

                <HasPermission
                    permissions={['core.change_status_attachment_field']}
                    userPermissions={userPermissions}
                >
                    <FormSelect
                        label="Status do Documento"
                        options={statusDoc}
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    />
                </HasPermission>

                <CustomTextField
                    label="Descrição"
                    name="description"
                    placeholder="Descrição do arquivo"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ marginTop: 2 }}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    {...(formErrors.description && { error: true, helperText: formErrors.description })}
                />

                {selectedFile && (
                    <List
                        sx={{
                            marginTop: 2,
                            border: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                        }}
                    >
                        <ListItem>
                            {getFileIcon(selectedFile.name)}
                            <Link
                                href={URL.createObjectURL(selectedFile)}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ marginLeft: 2 }}
                            >
                                {selectedFile.name.length > 30
                                    ? `${selectedFile.name.slice(0, 30)}...`
                                    : selectedFile.name}
                            </Link>
                        </ListItem>
                    </List>
                )}

                {formData.file?.length > 0 && !selectedFile && (
                    <List
                        sx={{
                            marginTop: 2,
                            border: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: 1,
                        }}
                    >
                        <ListItem>
                            {getFileIcon('file')}
                            <Link href={formData.file} target="_blank" rel="noopener noreferrer">
                                {formData.file?.length > 30
                                    ? `${formData.file.slice(0, 30)}...`
                                    : formData.file}
                            </Link>
                        </ListItem>
                    </List>
                )}

                <Button
                    onClick={handleSaveForm}
                    sx={{ marginTop: 2 }}
                    variant="contained"
                    disabled={formLoading}
                >
                    {formLoading ? <CircularProgress size={24} /> : 'Enviar'}
                </Button>
                <Button
                    onClick={handleCloseModal}
                    sx={{ marginTop: 2, marginLeft: 1 }}
                    variant="outlined"
                    disabled={formLoading}
                >
                    Fechar
                </Button>
            </Box>
        </Modal>
    );
}

export default AddAttachmentModal;