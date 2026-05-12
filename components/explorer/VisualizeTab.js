"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend,
  BarChart, Bar, Cell, ResponsiveContainer,
} from 'recharts';
import { histogramBins } from '@lib/stats';

const COLORS = ['#00897B','#F57F17','#1565C0','#AD1457','#6A1B9A','#2E7D32','#795548','#E64A19'];
const TEAL   = '#00897B';

export default function VisualizeTab({ dataset }) {
  const [chartType, setChartType] = useState('scatter');
  const [xAttr, setXAttr]         = useState(0);
  const [yAttr, setYAttr]         = useState(1);
  const [histAttr, setHistAttr]   = useState(0);

  useEffect(() => {
    setXAttr(0);
    setYAttr(1);
    setHistAttr(0);
    setChartType('scatter');
  }, [dataset]);

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset first.</Typography>
      </Box>
    );
  }

  const numericAttrs   = dataset.attributes.map((a, i) => ({ ...a, i })).filter(a => a.type === 'numeric');
  const allAttrs       = dataset.attributes.map((a, i) => ({ ...a, i }));
  const classAttr      = dataset.attributes[dataset.classIndex];
  const isNumericClass = classAttr?.type === 'numeric';

  const classValues = isNumericClass
    ? []
    : (classAttr?.values ?? [...new Set(dataset.instances.map(r => r[dataset.classIndex]).filter(v => v !== null))]);

  // --- Scatter ---
  const xI = numericAttrs[xAttr]?.i ?? 0;
  const yI = numericAttrs[yAttr]?.i ?? (numericAttrs[1]?.i ?? 0);

  let scatterContent;
  if (isNumericClass) {
    // regression: single series, no class coloring
    const pts = dataset.instances
      .filter(r => r[xI] !== null && r[yI] !== null)
      .map(r => ({ x: r[xI], y: r[yI] }));
    scatterContent = [<Scatter key="all" name="instances" data={pts} fill={TEAL} opacity={0.7} />];
  } else {
    const byClass = {};
    for (const cv of classValues) byClass[cv] = [];
    for (const r of dataset.instances) {
      const cv = r[dataset.classIndex];
      if (cv !== null && byClass[cv] && r[xI] !== null && r[yI] !== null)
        byClass[cv].push({ x: r[xI], y: r[yI] });
    }
    scatterContent = classValues.map((cv, i) => (
      <Scatter key={cv} name={cv} data={byClass[cv]} fill={COLORS[i % COLORS.length]} opacity={0.75} />
    ));
  }

  // --- Histogram ---
  const histI    = allAttrs[histAttr]?.i ?? 0;
  const histSel  = allAttrs[histAttr];
  let histData;
  if (histSel?.type === 'numeric') {
    histData = histogramBins(dataset.instances.map(r => r[histI]));
  } else {
    const freq = {};
    for (const r of dataset.instances) {
      const v = r[histI];
      if (v !== null) freq[v] = (freq[v] || 0) + 1;
    }
    histData = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>

      {/* Controls */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Chart type</Typography>
          <ToggleButtonGroup value={chartType} exclusive size="small" fullWidth
            onChange={(_, v) => v && setChartType(v)} sx={{ mb: 2 }}>
            <ToggleButton value="scatter" sx={{ fontSize: 12 }}>Scatter</ToggleButton>
            <ToggleButton value="histogram" sx={{ fontSize: 12 }}>Histogram</ToggleButton>
          </ToggleButtonGroup>

          {chartType === 'scatter' && numericAttrs.length >= 2 && (
            <>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Axes</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>X axis</InputLabel>
                <Select value={xAttr} label="X axis" onChange={e => setXAttr(e.target.value)}>
                  {numericAttrs.map((a, idx) => <MenuItem key={idx} value={idx}>{a.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Y axis</InputLabel>
                <Select value={yAttr} label="Y axis" onChange={e => setYAttr(e.target.value)}>
                  {numericAttrs.map((a, idx) => <MenuItem key={idx} value={idx}>{a.name}</MenuItem>)}
                </Select>
              </FormControl>
            </>
          )}

          {chartType === 'histogram' && (
            <>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Attribute</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Attribute</InputLabel>
                <Select value={histAttr} label="Attribute" onChange={e => setHistAttr(e.target.value)}>
                  {allAttrs.map((a, idx) => <MenuItem key={idx} value={idx}>{a.name}</MenuItem>)}
                </Select>
              </FormControl>
            </>
          )}

          {chartType === 'scatter' && !isNumericClass && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" fontWeight={700} display="block" gutterBottom>Classes</Typography>
              {classValues.map((cv, i) => (
                <Box key={cv} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <Typography variant="caption" noWrap>{cv}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Chart */}
      <Grid size={{ xs: 12, md: 9 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {chartType === 'scatter' ? (
            <>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {numericAttrs[xAttr]?.name ?? '—'} vs {numericAttrs[yAttr]?.name ?? '—'}
              </Typography>
              {numericAttrs.length < 2 ? (
                <Box sx={{ height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                  <Typography>Need at least 2 numeric attributes for a scatter plot.</Typography>
                </Box>
              ) : (
                <Box sx={{ height: 440 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
                      <XAxis dataKey="x" name={numericAttrs[xAttr]?.name} type="number" tick={{ fontSize: 10 }}
                        label={{ value: numericAttrs[xAttr]?.name, position: 'insideBottom', offset: -14, fontSize: 12 }} />
                      <YAxis dataKey="y" name={numericAttrs[yAttr]?.name} type="number" tick={{ fontSize: 10 }}
                        label={{ value: numericAttrs[yAttr]?.name, angle: -90, position: 'insideLeft', fontSize: 12 }} />
                      <ZAxis range={[22, 22]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v) => [v.toFixed ? v.toFixed(3) : v]} />
                      {!isNumericClass && <Legend />}
                      {scatterContent}
                    </ScatterChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </>
          ) : (
            <>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {histSel?.name} — {histSel?.type === 'numeric' ? 'distribution' : 'frequency'}
              </Typography>
              <Box sx={{ height: 440 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                    <XAxis dataKey={histSel?.type === 'numeric' ? 'x' : 'name'}
                      tick={{ fontSize: 10 }} hide={histData.length > 30} />
                    <YAxis tick={{ fontSize: 10 }} width={38} />
                    <Tooltip
                      formatter={(v) => [v, 'Count']}
                      labelFormatter={(_, payload) => {
                        if (!payload?.length) return '';
                        const d = payload[0].payload;
                        return histSel?.type === 'numeric' ? (d.label ?? `≈ ${d.x}`) : d.name;
                      }}
                    />
                    <Bar dataKey={histSel?.type === 'numeric' ? 'count' : 'value'} radius={[2, 2, 0, 0]}>
                      {histData.map((_, i) => (
                        <Cell key={i} fill={histSel?.type === 'nominal' ? COLORS[i % COLORS.length] : TEAL} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </>
          )}
        </Paper>
      </Grid>

    </Grid>
  );
}
