export const mask = (v) => {
    // Remove todos os caracteres não numéricos
    v = v.replace(/\D/g, "");
  
    if (v.length <= 11) {
      // Formata como CPF
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // Limita a 14 dígitos para o CNPJ
      v = v.substring(0, 14);
      // Formata como CNPJ
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
  
    return v;
  };
  