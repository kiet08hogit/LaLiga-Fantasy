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

function dateSort(rowA, rowB, columnId) {
  const a = new Date(rowA.getValue(columnId) || 0).getTime();
  const b = new Date(rowB.getValue(columnId) || 0).getTime();
  return a - b;
}

export const matchColumns = [
  {
    accessorKey: 'match_date',
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const val = row.original.match_date;
      if (!val) return '—';
      return new Date(val).toLocaleDateString();
    },
    sortingFn: dateSort,
  },
  {
    accessorKey: 'home_team',
    header: ({ column }) => <SortableHeader column={column} title="Home Team" />,
    sortingFn: textSort,
  },
  {
    id: 'score',
    header: 'Score',
    cell: ({ row }) => {
      const hg = row.original.home_goals ?? row.original.home_score ?? '—';
      const ag = row.original.away_goals ?? row.original.away_score ?? '—';
      return (
        <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>
          {hg} – {ag}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'away_team',
    header: ({ column }) => <SortableHeader column={column} title="Away Team" />,
    sortingFn: textSort,
  },
  {
    accessorKey: 'result',
    header: ({ column }) => <SortableHeader column={column} title="Result" />,
    cell: ({ row }) => {
      const r = row.original.result;
      if (!r) return '—';
      let cls = 'result-badge';
      let label = r;
      if (r === 'H') { cls += ' result-win'; label = 'H'; }
      else if (r === 'A') { cls += ' result-loss'; label = 'A'; }
      else if (r === 'D') { cls += ' result-draw'; label = 'D'; }
      return <span className={cls}>{label}</span>;
    },
    sortingFn: textSort,
  },
  {
    accessorKey: 'home_shots',
    header: ({ column }) => <SortableHeader column={column} title="H Shots" />,
    cell: ({ row }) => formatNumericCell(row.original.home_shots),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'away_shots',
    header: ({ column }) => <SortableHeader column={column} title="A Shots" />,
    cell: ({ row }) => formatNumericCell(row.original.away_shots),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'home_xg',
    header: ({ column }) => <SortableHeader column={column} title="H xG" />,
    cell: ({ row }) => formatNumericCell(row.original.home_xg, 2),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'away_xg',
    header: ({ column }) => <SortableHeader column={column} title="A xG" />,
    cell: ({ row }) => formatNumericCell(row.original.away_xg, 2),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'home_yellow_cards',
    header: ({ column }) => <SortableHeader column={column} title="H Yellows" />,
    cell: ({ row }) => formatNumericCell(row.original.home_yellow_cards),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'away_yellow_cards',
    header: ({ column }) => <SortableHeader column={column} title="A Yellows" />,
    cell: ({ row }) => formatNumericCell(row.original.away_yellow_cards),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'home_red_cards',
    header: ({ column }) => <SortableHeader column={column} title="H Reds" />,
    cell: ({ row }) => formatNumericCell(row.original.home_red_cards),
    sortingFn: nullsLastNumberSort,
  },
  {
    accessorKey: 'away_red_cards',
    header: ({ column }) => <SortableHeader column={column} title="A Reds" />,
    cell: ({ row }) => formatNumericCell(row.original.away_red_cards),
    sortingFn: nullsLastNumberSort,
  },
];
