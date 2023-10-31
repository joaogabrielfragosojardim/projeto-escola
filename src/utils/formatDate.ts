export function formatDateToISO(date: string) {
  const [day, month, year] = date.split('/');

  const dataISO = new Date(`${year}-${month}-${day}`);

  const dateISOFormatada = dataISO.toISOString();

  return dateISOFormatada;
}
