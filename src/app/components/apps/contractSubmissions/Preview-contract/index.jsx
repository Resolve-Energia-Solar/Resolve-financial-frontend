'use client';

import React from 'react';
import { Box, Modal } from '@mui/material';
import Contract from '@/app/components/templates/ContractPreview';

export default function PreviewContractModal({ open, onClose, sale }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          bgcolor: 'background.paper',
          boxShadow: 3,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 2,
        }}
      >
        {sale ? (
          <Contract
            id_customer={sale.customer?.complete_name || 'N/A'}
            id_first_document={sale.customer?.first_document || 'N/A'}
            id_second_document={sale.customer?.second_document || 'N/A'}
            id_customer_address={sale.customer?.address || 'N/A'}
            id_customer_house={sale.customer?.house_number || 'N/A'}
            id_customer_zip={sale.customer?.zip_code || 'N/A'}
            id_customer_city={sale.customer?.city || 'N/A'}
            id_customer_locality={sale.customer?.locality || 'N/A'}
            id_customer_state={sale.customer?.state || 'N/A'}
            quantity_material_3={sale.quantity_material_3 || 'N/A'}
            id_material_3={sale.material_3 || 'N/A'}
            id_material_1={sale.material_1 || 'N/A'}
            id_material_2={sale.material_2 || 'N/A'}
            watt_pico={sale.watt_pico || 'N/A'}
            project_value_format={
              sale.total_value
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(sale.total_value)
                : 'N/A'
            }
            id_payment_method={sale.payment_method || 'N/A'}
            id_payment_detail={sale.payment_detail || 'N/A'}
            observation_payment={sale.observation_payment || 'N/A'}
            dia={new Date().getDate()}
            mes={new Date().toLocaleString('default', { month: 'long' })}
            ano={new Date().getFullYear()}
          />
        ) : (
          <Box>N/A</Box>
        )}
      </Box>
    </Modal>
  );
}
