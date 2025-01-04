export const formatToBRL = (value) => {
    if (typeof value !== "number") {
      const numberValue = Number(value);
      if (isNaN(numberValue)) {
        console.error("Invalid value passed to formatToBRL:", value);
        return "R$ 0,00";
      }
      value = numberValue;
    }
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };
  