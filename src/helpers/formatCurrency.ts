export const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
  });
};
