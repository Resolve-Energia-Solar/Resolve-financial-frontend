  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length < 10 || cleaned.length > 11) return phone;

    const countryCode = "+55";

    const ddd = cleaned.slice(0, 2);
    const firstPart = cleaned.length === 10 ? cleaned.slice(2, 6) : cleaned.slice(2, 7);
    const secondPart = cleaned.length === 10 ? cleaned.slice(6) : cleaned.slice(7);

    return `${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
  };

  export default formatPhoneNumber;