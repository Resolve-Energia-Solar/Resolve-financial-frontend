import { Box, Grid } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useState } from "react";

export default function ProposalLayout({ formData }) {

  // const [openEditProposal, setOpenEditProposal] = useState();

  const printRef = React.useRef(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const dataImg = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    });

    const imgProperties = pdf.getImageProperties(dataImg);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;


    pdf.addImage(dataImg, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(dataImg, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save("proposta.pdf")

  }

  return (
    <Grid container>
      <Grid container>

        <Grid item xs={12}>
          <Box className="mt-6 flex justify-center">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Baixar PDF
            </button>

          </Box>
        </Grid>
        <Grid item>
          <Box>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Alterar proposta
            </button>

          </Box>
        </Grid>

      </Grid>
      <Grid container ref={printRef}>

        <Grid item xs={12}>
            <Box>
              <img
                src="/images/proposal/proposal_cover_background.png"
                alt="header yellow bar"
                sx={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              <img
                src="/images/proposal/bottom_border.png"
                alt="header yellow bar"
                sx={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
      </Grid>
    </Grid>
  );
}
