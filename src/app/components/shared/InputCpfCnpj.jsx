import React from "react";
import { mask } from "@/utils/cpfCnpjMask";
import CustomTextField from "../forms/theme-elements/CustomTextField";

function InputCpfCnpj({ value, onChange, onBlur }) {
  const handleChange = (e) => {
    // Aplica a máscara e passa o valor mascarado para o onChange
    const maskedValue = mask(e.target.value);
    // Cria um novo evento com o valor mascarado para que o pai possa extrair o valor (e.g., remover a formatação)
    onChange({
      ...e,
      target: {
        ...e.target,
        value: maskedValue,
      },
    });
  };

  return (
    <CustomTextField
      label="CPF/CNPJ"
      value={value}
      onChange={handleChange}
      placeholder="Digite CPF ou CNPJ"
      variant="outlined"
      fullWidth
      margin="normal"
      onBlur={onBlur}
    />
  );
}

export default InputCpfCnpj;
