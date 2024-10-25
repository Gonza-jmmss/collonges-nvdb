import DebouncedInput from "@/components/common/debouncedInput";

import { Column, Table } from "@tanstack/react-table";

export default function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36"
    />
  );
}

// function Filter({
//   column,
//   table,
// }: {
//   column: Column<any, any>;
//   table: Table<any>;
// }) {
//   const firstValue = table
//     .getPreFilteredRowModel()
//     .flatRows[0]?.getValue(column.id);

//   const columnFilterValue = column.getFilterValue();

//   return typeof firstValue === "number" ? (
//     <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
//       <input
//         type="number"
//         value={(columnFilterValue as [number, number])?.[0] ?? ""}
//         onChange={(e) =>
//           column.setFilterValue((old: [number, number]) => [
//             e.target.value,
//             old?.[1],
//           ])
//         }
//         placeholder={`Min`}
//         className="w-24 rounded border shadow"
//       />
//       <input
//         type="number"
//         value={(columnFilterValue as [number, number])?.[1] ?? ""}
//         onChange={(e) =>
//           column.setFilterValue((old: [number, number]) => [
//             old?.[0],
//             e.target.value,
//           ])
//         }
//         placeholder={`Max`}
//         className="w-24 rounded border shadow"
//       />
//     </div>
//   ) : (
//     <input
//       className="w-36 rounded border shadow"
//       onChange={(e) => column.setFilterValue(e.target.value)}
//       onClick={(e) => e.stopPropagation()}
//       placeholder={`Search...`}
//       type="text"
//       value={(columnFilterValue ?? "") as string}
//     />
//   );
// }
