import { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import mammoth from 'mammoth';

const useDocxTemplate = (templateData) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = () => {
    const templatePath = '/contract_model_01.docx';

    fetch(templatePath)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        try {
          setLoading(true);
          setError(null);

          const zip = new PizZip(data);
          const doc = new Docxtemplater(zip);

          doc.setData(templateData);
          doc.render();

          const out = doc.getZip().generate({ type: 'blob' });

          const link = document.createElement('a');
          link.href = URL.createObjectURL(out);
          link.download = 'documento_preenchido.docx';
          link.click();
        } catch (err) {
          setError('Erro ao preencher template');
          console.error(err);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        setError('Erro ao carregar o template');
        console.error(err);
      });
  };

  const generatePreview = async () => {
    const templatePath = '/contract_model_01.docx';

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(templatePath);
      const data = await response.arrayBuffer();

      const zip = new PizZip(data);
      const doc = new Docxtemplater(zip);

      doc.setData(templateData);
      doc.render();

      const out = doc.getZip().generate({ type: 'arraybuffer' });

      const result = await mammoth.convertToHtml({ arrayBuffer: out });

      return result.value; 
    } catch (err) {
      setError('Erro ao gerar preview');
      console.error(err);
      return '';
    } finally {
      setLoading(false);
    }
  };

  return { handleFileUpload, generatePreview, loading, error };
};

export default useDocxTemplate;
