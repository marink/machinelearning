"use client";

import { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, Grid, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { attributeStats, histogramBins } from '@lib/stats';

const TEAL = '#00897B';
const COLORS = ['#00897B','#F57F17','#1565C0','#AD1457','#6A1B9A','#2E7D32','#4E342E'];

export default function PreprocessTab({ dataset }) {
  const [selectedAttr, setSelectedAttr] = useState(0);

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset to start preprocessing.</Typography>
      </Box>
    );
  }

  const stats = attributeStats(dataset);
  const sel = stats[selectedAttr];
  const instances = dataset.instances;

  let chartData;
  if (sel.type === 'numeric') {
    chartData = histogramBins(instances.map(inst => inst[selectedAttr]));
  } else {
    chartData = Object.entries(sel.freq).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {/* Relation info */}
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700}>Relation:</Typography>
          <Typography variant="body2" fontFamily="monospace">{dataset.relation}</Typography>
          <Chip label={`${instances.length} instances`} size="small" color="primary" />
          <Chip label={`${dataset.attributes.length} attributes`} size="small" />
          <Chip label={`class: ${dataset.attributes[dataset.classIndex]?.name}`} size="small" color="secondary" />
        </Paper>
      </Grid>

      {/* Attribute list */}
      <Grid item xs={12} md={5}>
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <Box sx={{ p: 1.5, bgcolor: '#004D40', color: '#fff' }}>
            <Typography variant="subtitle2" fontWeight={700}>Attributes</Typography>
          </Box>
          <Box sx={{ maxHeight: 420, overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Missing</TableCell>
                  <TableCell>Distinct</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((s, i) => (
                  <TableRow
                    key={i}
                    hover
                    selected={i === selectedAttr}
                    onClick={() => setSelectedAttr(i)}
                    sx={{ cursor: 'pointer', '&.Mui-selected': { bgcolor: '#E0F2F1' } }}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell sx={{ fontWeight: i === dataset.classIndex ? 700 : 400 }}>
                      {s.name}{i === dataset.classIndex ? ' ★' : ''}
                    </TableCell>
                    <TableCell>
                      <Chip label={s.type} size="small" variant="outlined"
                        color={s.type === 'numeric' ? 'primary' : 'default'} />
                    </TableCell>
                    <TableCell>{s.missing}</TableCell>
                    <TableCell>{s.distinct}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Grid>

      {/* Selected attribute detail */}
      <Grid item xs={12} md={7}>
        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {sel.name} ({sel.type})
          </Typography>

          {sel.type === 'numeric' ? (
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {[['Min', sel.min],['Max', sel.max],['Mean', sel.mean],['StdDev', sel.stddev],['Median', sel.median]].map(([l, v]) => (
                <Grid item xs={4} key={l}>
                  <Box sx={{ bgcolor: '#F5F5F5', borderRadius: 1, p: 1, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">{l}</Typography>
                    <Typography variant="body2" fontWeight={700}>{v}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mode: <strong>{sel.mode}</strong> · {sel.distinct} distinct values
            </Typography>
          )}

          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <XAxis dataKey={sel.type === 'numeric' ? 'x' : 'name'} tick={{ fontSize: 10 }} hide={chartData.length > 30} />
                <YAxis tick={{ fontSize: 10 }} width={35} />
                <Tooltip
                  formatter={(v, n) => [v, 'Count']}
                  labelFormatter={l => sel.type === 'numeric'
                    ? `Value ≈ ${l}`
                    : l}
                />
                <Bar dataKey={sel.type === 'numeric' ? 'count' : 'value'} radius={[2, 2, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={sel.type === 'nominal' ? COLORS[i % COLORS.length] : TEAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
