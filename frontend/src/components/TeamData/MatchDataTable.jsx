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
import { Button } from '@/components/ui/button';
import { matchColumns } from './matchColumns';

const VENUE_FILTERS = [
  { label: 'All Matches', value: 'all' },
  { label: 'Home', value: 'home' },
  { label: 'Away', value: 'away' },
];

const RESULT_FILTERS = [
  { label: 'All Results', value: 'all' },
  { label: 'Home Win', value: 'H' },
  { label: 'Away Win', value: 'A' },
  { label: 'Draw', value: 'D' },
];

export function MatchDataTable({ data, teamName }) {
  const [sorting, setSorting] = React.useState([{ id: 'match_date', desc: true }]);
  const [venueFilter, setVenueFilter] = React.useState('all');
  const [resultFilter, setResultFilter] = React.useState('all');

  const columns = React.useMemo(() => matchColumns, []);

  // Client-side filtering for venue (home/away) and result
  const filteredData = React.useMemo(() => {
    let rows = data;

    if (teamName && venueFilter !== 'all') {
      const teamLower = teamName.toLowerCase();
      rows = rows.filter((match) => {
        if (venueFilter === 'home') return match.home_team?.toLowerCase() === teamLower;
        if (venueFilter === 'away') return match.away_team?.toLowerCase() === teamLower;
        return true;
      });
    }

    if (resultFilter !== 'all') {
      rows = rows.filter((match) => match.result === resultFilter);
    }

    return rows;
  }, [data, teamName, venueFilter, resultFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 15 },
    },
  });

  const filteredRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = Math.max(1, table.getPageCount());
  const from = filteredRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, filteredRows);

  return (
    <div className="dark font-sans text-lg leading-relaxed text-foreground antialiased">
      <div className="overflow-hidden rounded-lg border border-border bg-background shadow-md">
        {/* Filter bar */}
        <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          {/* Venue filter (only useful when a team is selected) */}
          {teamName && (
            <div className="match-filter-group">
              <label className="match-filter-label">Venue</label>
              <div className="match-filter-pills">
                {VENUE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`match-filter-pill ${venueFilter === f.value ? 'active' : ''}`}
                    onClick={() => {
                      setVenueFilter(f.value);
                      table.setPageIndex(0);
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result filter */}
          <div className="match-filter-group">
            <label className="match-filter-label">Result</label>
            <div className="match-filter-pills">
              {RESULT_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`match-filter-pill ${resultFilter === f.value ? 'active' : ''}`}
                  onClick={() => {
                    setResultFilter(f.value);
                    table.setPageIndex(0);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
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
                    No matches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col gap-4 border-t border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex-1 text-lg text-muted-foreground">
            {from}-{to} of {filteredRows} match{filteredRows === 1 ? '' : 'es'} · Page {pageIndex + 1} of{' '}
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
