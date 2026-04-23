import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { playerColumns } from './columns';

export function PlayerDataTable({ data }) {
  const [sorting, setSorting] = React.useState([{ id: 'minutes_played', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  const columns = React.useMemo(() => playerColumns, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  const nameFilter = table.getColumn('player_name')?.getFilterValue() ?? '';
  const filteredRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = Math.max(1, table.getPageCount());
  const from = filteredRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, filteredRows);

  return (
    <div className="dark font-sans text-lg leading-relaxed text-foreground antialiased">
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-md">
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Input
            placeholder="Filter players…"
            value={nameFilter}
            onChange={(e) => {
              table.getColumn('player_name')?.setFilterValue(e.target.value);
              table.setPageIndex(0);
            }}
            className="h-12 max-w-md min-w-[min(100%,300px)] px-4 text-lg"
            autoComplete="off"
          />
        </div>

        <div className="border-t border-border">
          <Table className="min-w-[1100px] text-lg">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-border bg-muted/40 hover:bg-muted/40 data-[state=selected]:bg-muted/40"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-16 px-3 py-3 text-lg font-semibold text-muted-foreground sm:px-5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-border hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-3 py-4 text-lg tabular-nums text-foreground sm:px-5"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={columns.length} className="h-32 text-center text-lg text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-4 border-t border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex-1 text-lg text-muted-foreground">
            {from}-{to} of {filteredRows} row{filteredRows === 1 ? '' : 's'} · Page {pageIndex + 1} of{' '}
            {pageCount}
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 min-w-[6.5rem] text-lg"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 min-w-[6.5rem] text-lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
