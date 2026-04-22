"use client";

import { useState } from 'react';
import {
  Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#00897B','#F57F17','#1565C0','#AD1457','#6A1B9A','#2E7D32','#795548','#E64A19'];

export default function VisualizeTab({ dataset }) {
  const [xAttr, setXAttr] = useState(0);
  const [yAttr, setYAttr] = useState(1);

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset first.</Typography>
      </Box>
    );
  }

  const numericAttrs = dataset.attributes.map((a, i) => ({ ...a, i })).filter(a => a.type === 'numeric');
  const classAttr = dataset.attributes[dataset.classIndex];
  const classValues = classAttr?.values ?? [...new Set(dataset.instances.map(i => i[dataset.classIndex]).filter(v => v !== null))];

  const xI = numericAttrs[xAttr]?.i ?? 0;
  const yI = numericAttrs[yAttr]?.i ?? 1;

  const byClass = {};
  for (const cv of classValues) byClass[cv] = [];
  for (const inst of dataset.instances) {
    const cv = inst[dataset.classIndex];
    if (cv !== null && byClass[cv]) {
      byClass[cv].push({ x: inst[xI], y: inst[yI] });
    }
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={3}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Axes</Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>X axis</InputLabel>
            <Select value={xAttr} label="X axis" onChange={e => setXAttr(e.target.value)}>
              {numericAttrs.map((a, idx) => <MenuItem key={idx} value={idx}>{a.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Y axis</InputLabel>
            <Select value={yAttr} label="Y axis" onChange={e => setYAttr(e.target.value)}>
              {numericAttrs.map((a, idx) => <MenuItem key={idx} value={idx}>{a.name}</MenuItem>)}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" fontWeight={700} display="block" gutterBottom>Classes</Typography>
            {classValues.map((cv, i) => (
              <Box key={cv} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length] }} />
                <Typography variant="caption">{cv} ({byClass[cv]?.length ?? 0})</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={9}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {numericAttrs[xAttr]?.name} vs {numericAttrs[yAttr]?.name}
          </Typography>
          <Box sx={{ height: 440 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
                <XAxis dataKey="x" name={numericAttrs[xAttr]?.name} type="number" tick={{ fontSize: 10 }}
                  label={{ value: numericAttrs[xAttr]?.name, position: 'insideBottom', offset: -12, fontSize: 12 }} />
                <YAxis dataKey="y" name={numericAttrs[yAttr]?.name} type="number" tick={{ fontSize: 10 }}
                  label={{ value: numericAttrs[yAttr]?.name, angle: -90, position: 'insideLeft', fontSize: 12 }} />
                <ZAxis range={[25, 25]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }}
                  formatter={(v, n) => [v.toFixed(2), n]} />
                <Legend />
                {classValues.map((cv, i) => (
                  <Scatter key={cv} name={cv} data={byClass[cv]} fill={COLORS[i % COLORS.length]} opacity={0.75} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
