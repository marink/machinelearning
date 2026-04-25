"use client";

import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Typography, Chip } from '@mui/material';

export default function DataTab({ dataset }) {
  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset to view the data.</Typography>
      </Box>
    );
  }

  const { attributes, instances, classIndex } = dataset;

  const columns = useMemo(() =>
    attributes.map((attr, i) => ({
      accessorKey: String(i),
      header: attr.name,
      size: attr.type === 'numeric' ? 110 : 140,
      Header: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <span style={{ fontWeight: i === classIndex ? 700 : 500 }}>{attr.name}</span>
          {i === classIndex && (
            <Chip label="class" size="small" color="secondary"
              sx={{ height: 16, fontSize: 10, '& .MuiChip-label': { px: 0.75 } }} />
          )}
          {attr.type === 'numeric' && (
            <Chip label="num" size="small" color="primary" variant="outlined"
              sx={{ height: 16, fontSize: 10, '& .MuiChip-label': { px: 0.75 } }} />
          )}
        </Box>
      ),
      Cell: ({ cell }) => {
        const val = cell.getValue();
        const isClass = i === classIndex;
        return (
          <Box component="span" sx={{
            fontFamily: attr.type === 'numeric' ? 'monospace' : 'inherit',
            fontWeight: isClass ? 600 : 400,
            color: isClass ? '#1565C0' : 'inherit',
            fontSize: 13,
          }}>
            {val === null || val === undefined || val === '' ? (
              <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: 12 }}>?</Box>
            ) : val}
          </Box>
        );
      },
    })),
  [attributes, classIndex]);

  const data = useMemo(() =>
    instances.map((row, rowIdx) => {
      const obj = { __rowIdx: rowIdx };
      row.forEach((val, i) => { obj[String(i)] = val; });
      return obj;
    }),
  [instances]);

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnResizing: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableDensityToggle: true,
    enableFullScreenToggle: false,
    enableHiding: true,
    columnResizeMode: 'onChange',
    initialState: {
      density: 'compact',
      pagination: { pageSize: 25 },
      showGlobalFilter: true,
    },
    muiTableContainerProps: { sx: { maxHeight: 'calc(100vh - 220px)' } },
    muiTableHeadCellProps: {
      sx: { bgcolor: '#E3F0FF', fontWeight: 700, fontSize: 13, py: 1 },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: { '&:hover td': { bgcolor: '#F1F8F7' } },
    }),
    muiTableBodyCellProps: {
      sx: { py: 0.4, px: 1.5, fontSize: 13, borderBottom: '1px solid rgba(0,0,0,0.06)' },
    },
    muiTopToolbarProps: { sx: { bgcolor: '#FAFAFA', borderBottom: '1px solid rgba(0,0,0,0.08)' } },
    muiBottomToolbarProps: { sx: { bgcolor: '#FAFAFA', borderTop: '1px solid rgba(0,0,0,0.08)' } },
    muiPaginationProps: { rowsPerPageOptions: [10, 25, 50, 100, 200] },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', pl: 1 }}>
        <Chip label={`${instances.length} rows`} size="small" color="primary" />
        <Chip label={`${attributes.length} cols`} size="small" variant="outlined" />
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}
