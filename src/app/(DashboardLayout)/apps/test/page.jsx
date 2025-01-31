'use client';
import React, { useState } from 'react';
import AlertTransition from '@/app/components/ui-components/alert/AlertTransition';

const TestPage = () => {
    const [alert, setAlert] = useState({ open: false, message: "", type: "info" });

    const handleShowAlert = (message, type) => {
        setAlert({ open: true, message, type });
    };

    return (
        <div>
            <button onClick={() => handleShowAlert("Operação concluída com sucesso!", "success")}>Sucesso</button>
            <button onClick={() => handleShowAlert("Erro ao processar a ação.", "error")}>Erro</button>
            <button onClick={() => handleShowAlert("Atenção: algo pode estar errado.", "warning")}>Aviso</button>
            <button onClick={() => handleShowAlert("Informação importante.", "info")}>Info</button>

            <AlertTransition 
                message={alert.message} 
                type={alert.type} 
                open={alert.open} 
                onClose={() => setAlert({ ...alert, open: false })}
            />
        </div>
    );
};

export default TestPage;
