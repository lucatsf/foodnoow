export const formatFromMoney = (value) => {
  if (value && typeof value === 'number') {
    const newValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
    return newValue;
  }
  if (value && typeof value === 'string') {
    const numericValue = value.replace(/\D/g, '');
    const result = numericValue ? parseFloat(numericValue) : 0;

    const newValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(result / 100);
    return newValue;
  }
}

export const getValueMoney = (value) => {
  if (value && typeof value === 'number') {
    return value;
  }
  const numericValue = value.replace(/\D/g, '');
  const result = numericValue ? parseFloat(numericValue) : 0;
  return result / 100;
}
