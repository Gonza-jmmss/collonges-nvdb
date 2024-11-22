import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Icon from "@/components/common/icon";
import Combobox from "@/components/common/combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// A TanStack fork of Kent C. Dodds' match-sorter library that provides ranking information
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

import {
  ColumnFiltersState,
  FilterFn,
  ColumnDef,
  SortingFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import DebouncedInput from "@/components/common/debouncedInput";
import Filter from "@/components/common/filter";
import { Value } from "@radix-ui/react-select";
import { set } from "zod";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const paginationValues = [
  { key: "10", value: 10 },
  { key: "20", value: 20 },
  { key: "30", value: 30 },
  { key: "40", value: 40 },
  { key: "50", value: 50 },
];

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
// const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
//   let dir = 0;

//   // Only sort by rank if the column has ranking information
//   if (rowA.columnFiltersMeta[columnId]) {
//     dir = compareItems(
//       rowA.columnFiltersMeta[columnId]?.itemRank!,
//       rowB.columnFiltersMeta[columnId]?.itemRank!,
//     );
//   }

//   // Provide an alphanumeric fallback for when the item ranks are equal
//   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
// };

type OnRowClick<T> = (row: T) => void;

interface TableProps<T> {
  // columns: ColumnType[];
  columns: any;
  data: T[];
  onRowClick?: (row: any) => void;
  className?: string;
  minimalMode?: boolean;
}
export default function TableComponent<T>({
  columns,
  data,
  onRowClick,
  className,
  minimalMode,
}: TableProps<T>) {
  // const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [isColumnSearch, setIsColumnSearch] = React.useState(false);

  const [rowsNumber, setRowsNumber] = React.useState(10);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div className="w-full">
      {minimalMode ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      // <TableHead key={header.id}>
                      //   {header.isPlaceholder
                      //     ? null
                      //     : flexRender(
                      //         header.column.columnDef.header,
                      //         header.getContext(),
                      //       )}
                      // </TableHead>
                      <TableHead key={header.id}>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center min-h-10"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <Icon
                                name={"MdOutlineNorth"}
                                // size={13}
                                className="ml-0.5"
                              />
                            ),
                            desc: (
                              <Icon
                                name={"MdSouth"}
                                // size={13}
                                className="ml-0.5"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {isColumnSearch && header.column.getCanFilter() ? (
                          <div className="pb-1">
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="flex items-center py-4">
            <div>
              <DebouncedInput
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(String(value))}
                placeholder="Search all columns..."
                className="w-[30vw]"
              />
            </div>
            <div
              className={`mx-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border`}
              onClick={() => setIsColumnSearch(!isColumnSearch)}
            >
              <Icon
                name={"MdManageSearch"}
                className={`text-xl ${isColumnSearch ? "text-primary hover:text-neutral-700" : "text-neutral-700 hover:text-primary"}`}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        // <TableHead key={header.id}>
                        //   {header.isPlaceholder
                        //     ? null
                        //     : flexRender(
                        //         header.column.columnDef.header,
                        //         header.getContext(),
                        //       )}
                        // </TableHead>
                        <TableHead key={header.id}>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center min-h-10"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <Icon
                                  name={"MdOutlineNorth"}
                                  // size={13}
                                  className="ml-0.5"
                                />
                              ),
                              desc: (
                                <Icon
                                  name={"MdSouth"}
                                  // size={13}
                                  className="ml-0.5"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {isColumnSearch && header.column.getCanFilter() ? (
                            <div className="pb-1">
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <div className="flex -space-x-3">
                <Icon name={"MdChevronLeft"} className="text-xl" />
                <Icon name={"MdChevronLeft"} className="text-xl" />
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Icon name={"MdChevronLeft"} className="text-xl" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Icon name={"MdChevronRight"} className="text-xl" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <div className="flex -space-x-3">
                <Icon name={"MdChevronRight"} className="text-xl" />
                <Icon name={"MdChevronRight"} className="text-xl" />
              </div>
            </Button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <Input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-10 justify-center p-1"
              />
            </span>
            <Combobox
              options={paginationValues}
              textAttribute="key"
              valueAttribute="value"
              placeholder="rows"
              itemSelected={rowsNumber}
              setItemSelected={setRowsNumber}
            />
          </div>
        </>
      )}
    </div>
  );
}
