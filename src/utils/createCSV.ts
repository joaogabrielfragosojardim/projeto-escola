export const createCSV = (data: any, columns: string[], name?: string) => {
  const columnsCSV = columns.join(';');
  const dataArrayCSV = data.map((item: any) => Object.values(item));
  const dataCSV = dataArrayCSV
    .map((subArray: any) => subArray.join(';'))
    .join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
    columnsCSV + dataCSV,
  )}`;

  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `${name || 'relatorio'}.csv`);
  link.click();
};
