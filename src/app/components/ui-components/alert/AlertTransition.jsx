'use client';
import React, { useState, useEffect } from 'react';
import { IconX } from "@tabler/icons-react";
import { Snackbar, Alert, IconButton } from '@mui/material';

const AlertTransition = ({ message, type = "info", open, onClose }) => {
    const [visible, setVisible] = useState(open);

    useEffect(() => {
        setVisible(open);
    }, [open]);

    console.log('message:', message);

    return (
        <Snackbar
            open={visible}
            autoHideDuration={5000} // Fecha automaticamente após 5s
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posição no canto superior direito
        >
            <Alert
                variant="filled"
                severity={type} // Tipos: "success", "error", "warning", "info"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={onClose}
                    >
                        <IconX width={20} />
                    </IconButton>
                }
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertTransition;
