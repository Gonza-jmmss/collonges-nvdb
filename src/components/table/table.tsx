"use client";

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
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnFiltersState,
  FilterFn,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  VisibilityState,
  PaginationState,
} from "@tanstack/react-table";
import DebouncedInput from "@/components/common/debouncedInput";
import Filter from "@/components/common/filter";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
// import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";
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
  noBorders?: boolean;
  expandable?: boolean;
  expandedContent?: React.ReactNode | ((row: T) => React.ReactNode);
  pageIndexParam?: number;
  pageSizeParam?: number;
}
export default function TableComponent<T>({
  columns,
  data,
  onRowClick,
  className,
  minimalMode,
  noBorders,
  expandable,
  expandedContent,
  pageIndexParam,
  pageSizeParam,
}: TableProps<T>) {
  const t = frFR;
  const updateQuery = useUpdateQuery();

  // const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [isColumnSearch, setIsColumnSearch] = React.useState(false);

  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: pageIndexParam !== undefined ? pageIndexParam : 0,
    pageSize: pageSizeParam !== undefined ? pageSizeParam : 10,
  });

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
      expanded,
      pagination,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    // getSubRows: (row) => row.subRows,
    // getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getRowCanExpand: () => expandable || false,
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    //
  });

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);
  };

  React.useEffect(() => {
    console.log("pagination", pagination);
    handleUrlParameterChange("pageIndex", `${pagination.pageIndex}`);
    handleUrlParameterChange("pageSize", `${pagination.pageSize}`);
  }, [pagination]);

  return (
    <div className="w-full">
      {minimalMode ? (
        <div className={`${noBorders ? "" : "rounded-md border"}`}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.columnDef.size || "auto",
                        }}
                      >
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
                                className="ml-0.5"
                              />
                            ),
                            desc: <Icon name={"MdSouth"} className="ml-0.5" />,
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
                  <React.Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      className={`${onRowClick != null && "cursor-pointer"}`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.columnDef.size || "auto",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={row.getAllCells().length}>
                          <div>
                            {typeof expandedContent === "function"
                              ? expandedContent(row.original)
                              : expandedContent}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t.table.noResults}
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
            {/* Columns filter (Not working) */}
            {/* <div
              className={`mx-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border`}
              onClick={() => setIsColumnSearch(!isColumnSearch)}
            >
              <Icon
                name={"MdManageSearch"}
                className={`text-xl ${isColumnSearch ? "text-primary hover:text-neutral-700" : "text-neutral-700 hover:text-primary"}`}
              />
            </div> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  {t.table.columns} <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                        <TableHead
                          key={header.id}
                          style={{
                            width: header.column.columnDef.size || "auto",
                          }}
                        >
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
                                <Icon name={"MdSouth"} className="ml-0.5" />
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
                    <React.Fragment key={row.id}>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => onRowClick?.(row.original)}
                        className={`${onRowClick != null && "cursor-pointer"}`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            style={{
                              width: cell.column.columnDef.size || "auto",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow>
                          <TableCell colSpan={row.getAllCells().length}>
                            <div>
                              {typeof expandedContent === "function"
                                ? expandedContent(row.original)
                                : expandedContent}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t.table.noResults}
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
            <div>
              <span>{`${t.table.totalRows} `}</span>
              <span className="font-semibold">{`${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - ${table.getState().pagination.pageIndex + 1 === table.getPageCount() ? table.getRowCount() : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize} de ${table.getRowCount()}`}</span>
            </div>
            {/* <span className="flex items-center gap-1">
              <div>{t.table.page}</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} {t.table.of}{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span> */}
            <span className="flex items-center gap-1">
              {t.table.goToPage}
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
            <div className="w-min">
              <Combobox
                options={paginationValues}
                textAttribute="key"
                valueAttribute="value"
                placeholder="rows"
                itemSelected={paginationValues.find(
                  (x) => x.value === table.getState().pagination.pageSize,
                )}
                setItemSelected={(x: { value: number }) =>
                  table.setPageSize(x.value)
                }
              />
            </div>
          </div>
        </>
      )}
      {/* <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2,
        )}
      </pre> */}
    </div>
  );
}
