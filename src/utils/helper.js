// Amount format
export const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === "") return "0";
    const str = amount.toString().trim();
    if (str === "0") return "0";
    
    const num = Number(str);
    if (isNaN(num)) return str;

    const parts = str.split('.');
    const integerPart = Number(parts[0]);
    const formattedInteger = integerPart.toLocaleString('en-IN');
    
    return parts.length > 1 ? `${formattedInteger}.${parts[1]}` : formattedInteger;
  };