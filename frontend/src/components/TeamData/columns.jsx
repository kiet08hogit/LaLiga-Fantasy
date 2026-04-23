import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

function SortableHeader({ column, title }) {
  return (
    <Button
      variant="ghost"
      type="button"
      className="-ml-2 h-11 gap-1 px-2 text-lg lg:px-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {title}
      <ArrowUpDown className="h-5 w-5 shrink-0 opacity-60 sm:ml-1" />
    </Button>
  );
}

function formatNumericCell(value, decimals) {
  if (value === null || value === undefined || value === '') return '—';
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return '—';
  if (decimals != null) return n.toFixed(decimals);
  return n;
}

function nullsLastNumberSort(rowA, rowB, columnId) {
  const read = (row) => {
    const v = row.getValue(columnId);
    if (v === null || v === undefined || v === '') return null;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const a = read(rowA);
  const b = read(rowB);
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
}

function textSort(rowA, rowB, columnId) {
  const a = String(rowA.getValue(columnId) ?? '').toLowerCase();
  const b = String(rowB.getValue(columnId) ?? '').toLowerCase();
  return a.localeCompare(b, undefined, { numeric: true });
}

export const playerColumns = [
  {
    accessorKey: 'player_name',
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      const name = String(row.getValue(id) ?? '').toLowerCase();
      return name.includes(String(filterValue).toLowerCase());
    },
    sortingFn: textSort,
  },
  {
    accessorKey: 'team',
    header: ({ column }) => <SortableHeader column={column} title="Team" />,
    sortingFn: textSort,
  },
  {
    accessorKey: 'position',
    header: ({ column }) => <SortableHeader column={column} title="Position" />,
    sortingFn: textSort,
  },
  {
    accessorKey: 'age',
    header: ({ column }) => <SortableHeader column={column} title="Age" />,
    sortingFn: textSort,
  },
  {
    accessorKey: 'nation',
    header: ({ column }) => <SortableHeader column={column} title="Nation" />,
    sortingFn: textSort,
  },
  {
    accessorKey: 'matches_played',
    header: ({ column }) => <SortableHeader column={column} title="Matches" />,
    cell: ({ row }) => formatNumericCell(row.original.matches_played),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'starts',
    header: ({ column }) => <SortableHeader column={column} title="Starts" />,
    cell: ({ row }) => formatNumericCell(row.original.starts),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'minutes_played',
    header: ({ column }) => <SortableHeader column={column} title="Mins" />,
    cell: ({ row }) => formatNumericCell(row.original.minutes_played),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'goals',
    header: ({ column }) => <SortableHeader column={column} title="Goals" />,
    cell: ({ row }) => formatNumericCell(row.original.goals),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'assists',
    header: ({ column }) => <SortableHeader column={column} title="Assists" />,
    cell: ({ row }) => formatNumericCell(row.original.assists),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'penalties_scored',
    header: ({ column }) => <SortableHeader column={column} title="Pens" />,
    cell: ({ row }) => formatNumericCell(row.original.penalties_scored),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'yellow_cards',
    header: ({ column }) => <SortableHeader column={column} title="Yellows" />,
    cell: ({ row }) => formatNumericCell(row.original.yellow_cards),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'red_cards',
    header: ({ column }) => <SortableHeader column={column} title="Reds" />,
    cell: ({ row }) => formatNumericCell(row.original.red_cards),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'expected_goals',
    header: ({ column }) => <SortableHeader column={column} title="xG" />,
    cell: ({ row }) => formatNumericCell(row.original.expected_goals, 2),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'expected_assists',
    header: ({ column }) => <SortableHeader column={column} title="xAG" />,
    cell: ({ row }) => formatNumericCell(row.original.expected_assists, 2),
    sortingFn: nullsLastNumberSort,
  },
];
