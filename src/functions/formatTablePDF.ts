export type Column<T> = {
  name: string;
  value: keyof T;
  cell?: (row: T) => any;
  formatFn?: (value: any) => any;
};

type PDFTable<T> = {
  columns: { header: string; dataKey: keyof T }[];
  body: Record<keyof T, any>[];
};

const formatTablePDF = <T>(columns: Column<T>[], rows: T[]): PDFTable<T> => {
  const cols: { header: string; dataKey: keyof T }[] = [];
  const body: Record<keyof T, any>[] = [];
  let bodyLine: Record<keyof T, any> = {} as Record<keyof T, any>;

  // Column format
  columns.forEach((column) => {
    cols.push({ header: column.name, dataKey: column.value });
  });

  rows.forEach((row) => {
    // Loops over the "column" data provided
    columns.forEach((column) => {
      const value = column.cell ? column.cell(row) : row[column.value]; // Use the "cell" function if provided, otherwise use the raw value
      // Sets the corresponding key and value based on "column" to "line" Object
      bodyLine[column.value] = column.formatFn ? column.formatFn(value) : value; // Apply the "formatFn" if provided, otherwise set the raw value
    });
    body.push(bodyLine); // Push "line" Object to the "data" array
    bodyLine = {} as Record<keyof T, any>; // Clears data from "line" Object
  });

  return {
    columns: cols,
    body: body,
  };
};

export default formatTablePDF;
