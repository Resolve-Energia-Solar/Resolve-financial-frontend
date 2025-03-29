import React, { useState, useEffect } from 'react';
import PulsingBadge from '@/app/components/shared/PulsingBadge';
import attachmentService from '@/services/attachmentService';

const PaymentDocBadge = ({ saleId, contentType }) => {
  const [badgeColor, setBadgeColor] = useState(null);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await attachmentService.index({
          expand: "document_type",
          fields: "document_type.name,status",
          object_id: saleId,
          content_type: contentType,
        });
        const attachments = response.results || [];
        // Filtra os attachments cujo document_type.name contenha "Comprovante de pagamento"
        const comprovantes = attachments.filter(att =>
          att.document_type?.name?.toLowerCase().includes("comprovante de pagamento")
        );
        if (comprovantes.length > 0) {
          // Se existir algum com status "EA" => laranja
          if (comprovantes.some(att => att.status === "EA")) {
            setBadgeColor("orange");
          } else if (comprovantes.some(att => att.status === "A")) {
            // Se existir algum com status "A" => verde
            setBadgeColor("green");
          } else {
            setBadgeColor(null);
          }
        } else {
          setBadgeColor(null);
        }
      } catch (error) {
        console.error("Erro ao buscar attachments:", error);
        setBadgeColor(null);
      }
    };
    fetchAttachments();
  }, [saleId, contentType]);

  if (!badgeColor) return null;
  return <PulsingBadge color={badgeColor} />;
};

export default PaymentDocBadge;
