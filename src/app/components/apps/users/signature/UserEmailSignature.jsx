import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Container, Grid, Button, Typography } from '@mui/material';
import './Signature.css';

const EmailSignature = ({ user }) => {
  const captureRef = useRef(null);
  const [isIncomplete, setIsIncomplete] = useState(false);
  const [pngUrl, setPngUrl] = useState(null);

  const mainPhone = user.phone_numbers.find((phone) => phone.is_main) || user.phone_numbers[0];

  const checkIncompleteData = () => {
    if (
      !user.complete_name ||
      !user.email ||
      !mainPhone ||
      !mainPhone.area_code ||
      !mainPhone.phone_number ||
      !user.employee?.role?.name ||
      !user.employee?.branch?.address?.complete_address
    ) {
      setIsIncomplete(true);
    } else {
      setIsIncomplete(false);
    }
  };

  const generateAndDownload = () => {
    const filename = `${user.complete_name} - Assinatura do E-mail.png`;
    if (pngUrl) {
      // se já gerou, baixa direto
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      link.click();
    } else if (captureRef.current) {
      // se ainda não gerou, gera e baixa
      html2canvas(captureRef.current).then((canvas) => {
        const url = canvas.toDataURL('image/png');
        setPngUrl(url);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
      });
    }
  };

  const displayName =
    user.complete_name.length > 24
      ? `${user.complete_name.split(' ')[0]} ${user.complete_name.split(' ').pop()}`
      : user.complete_name;

  useEffect(() => {
    checkIncompleteData();
  }, [user]);

  useEffect(() => {
    if (!isIncomplete && captureRef.current) {
      html2canvas(captureRef.current).then((canvas) => {
        setPngUrl(canvas.toDataURL('image/png'));
      });
    }
  }, [isIncomplete]);

  return (
    <Container>
      {isIncomplete && (
        <Grid container justifyContent="center" mt={2}>
          <Grid item>
            <Typography color="error" variant="body1">
              O cadastro está incompleto. Favor verificar as informações do usuário.
            </Typography>
          </Grid>
        </Grid>
      )}

      {!isIncomplete && (
        <Grid container justifyContent="center">
          <div id="capture-container" className="row justify-content-center">
            {pngUrl ? (
              <img
                src={pngUrl}
                alt="Assinatura gerada"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            ) : (
              <div ref={captureRef} id="capture">
                <img
                  src="/images/backgrounds/signature_template.png"
                  alt="Canva da Assinatura"
                />
                <div id="user-info">
                  <h1 id="username">{displayName}</h1>
                  <h2>{user.employee.role.name}</h2>
                  <h3 id="telephone">
                    ({mainPhone.area_code}) {mainPhone.phone_number.slice(0, 5)}-
                    {mainPhone.phone_number.slice(5)}
                  </h3>
                  <h3 id="instagram">@resolveenergiasolar</h3>
                  <h3 id="email">{user.email}</h3>
                  <h3 id="address">{user.employee.branch.address.complete_address}</h3>
                </div>
              </div>
            )}
          </div>
        </Grid>
      )}

      <Grid container justifyContent="center" spacing={2} mt={2}>
        <Grid item>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={generateAndDownload}
            disabled={isIncomplete}
          >
            Baixar Assinatura
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            href="mailto:chamados.ti@resolvenergiasolar.com"
          >
            Algum erro? Contate a TI.
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="info"
            size="small"
            href="https://support.microsoft.com/pt-br/office/criar-e-adicionar-uma-assinatura-de-email-no-outlook-8ee5d4f4-68fd-464a-a1c1-0e1c80bb27f2"
            target="_blank"
          >
            Como adicionar ao meu e‑mail?
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmailSignature;
