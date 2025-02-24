import React from 'react';
import SummaryCard from '../../../../../../components/SummaryCard';
import {
  useReactTable,
  ColumnResizeMode,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeDirection,
} from '@tanstack/react-table';
import WithdrawLedger from '../../../Profile/pages/WithdrawLedger';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
];

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    size: 150,
  },
  {
    accessorKey: 'visits',
    header: 'Visits',
    size: 150,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 150,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    size: 150,
  },
];

export default function WithdrawHistory() {
  const [data] = React.useState(() => [...defaultData]);
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const [columnResizeMode, setColumnResizeMode] = React.useState<ColumnResizeMode>('onChange');

  const [columnResizeDirection, setColumnResizeDirection] = React.useState<ColumnResizeDirection>('ltr');

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <SummaryCard headerIcon="/assets/svgs/withdraw-ledger.svg" headerTitle="Withdraw History">
      <WithdrawLedger />
      {/* <table
          {...{
            style: {
              width: table.getCenterTotalSize(),
            },
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${table.options.columnResizeDirection} ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          transform:
                            columnResizeMode === 'onEnd' && header.column.getIsResizing()
                              ? `translateX(${
                                  (table.options.columnResizeDirection === 'rtl' ? -1 : 1) *
                                  (table.getState().columnSizingInfo.deltaOffset ?? 0)
                                }px)`
                              : '',
                        },
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    {...{
                      key: cell.id,
                      style: {
                        width: cell.column.getSize(),
                      },
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table> */}
    </SummaryCard>
  );
}
