import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import documentTypeService from '@/services/documentTypeService';

const DocumentTypeSelect = ({ appLabel, documentType, documentSubtype, handleChange }) => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const response = await documentTypeService.index({
          page: 1,
          limit: 50,
          app_label__in: appLabel,
        });
        const results = response.data?.results || response.results || [];
        const options = results.map((docType) => ({
          id: docType.id,
          name: docType.name,
          subtypes: docType.subtypes || [],
        }));
        setDocumentTypes(options);
      } catch (error) {
        console.error('Erro ao buscar tipos de documento:', error);
      }
    };
    fetchDocumentTypes();
  }, [appLabel]);

  return (
    <>
      <Autocomplete
        options={documentTypes}
        getOptionLabel={(option) => option.name || ''}
        value={documentTypes.find((dt) => dt.id === documentType) || null}
        noOptionsText="Nenhum tipo de documento encontrado, mude a busca ou digite algo."
        loadingText="Carregando..."
        onChange={(event, newValue) => {
          setSelectedDocType(newValue);
          handleChange('document_type', newValue ? newValue.id : '');
        }}
        renderInput={(params) => (
          <TextField {...params} label="Tipo de Documento" variant="outlined" fullWidth />
        )}
      />
      {selectedDocType?.subtypes?.length > 0 && (
        <Autocomplete
          sx={{ mt: 2 }}
          options={selectedDocType.subtypes}
          getOptionLabel={(option) => option.name || ''}
          value={selectedDocType.subtypes.find((sub) => sub.id === documentSubtype) || null}
          onChange={(event, newValue) =>
            handleChange('document_subtype', newValue ? newValue.id : '')
          }
          renderInput={(params) => (
            <TextField {...params} label="Subtipo de Documento" variant="outlined" fullWidth />
          )}
        />
      )}
    </>
  );
};

export default DocumentTypeSelect;
