"use client";

import { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Grid, Slider, CircularProgress,
  FormControl, InputLabel, Select, MenuItem,
  Table, TableHead, TableBody, TableRow, TableCell,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { cluster } from '@lib/algorithms/kmeans';

const COLORS = ['#00897B','#F57F17','#1565C0','#AD1457','#6A1B9A','#2E7D32','#795548'];

function CentroidDot({ cx, cy, fill }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="white" stroke={fill} strokeWidth={2.5} />
      <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke={fill} strokeWidth={2} />
      <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke={fill} strokeWidth={2} />
    </g>
  );
}

export default function ClusterTab({ dataset }) {
  const [k,       setK]       = useState(3);
  const [result,  setResult]  = useState(null);
  const [running, setRunning] = useState(false);
  const [xSel,    setXSel]    = useState(0);
  const [ySel,    setYSel]    = useState(1);

  useEffect(() => {
    setResult(null);
    setXSel(0);
    setYSel(1);
  }, [dataset]);

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset first.</Typography>
      </Box>
    );
  }

  const numericAttrs = dataset.attributes
    .map((a, i) => ({ name: a.name, origIdx: i }))
    .filter((_, i) => i !== dataset.classIndex && dataset.attributes[i].type === 'numeric');

  function runCluster() {
    setRunning(true);
    setTimeout(() => {
      try {
        setResult(cluster(dataset, k));
      } catch (e) {
        setResult({ error: e.message });
      } finally {
        setRunning(false);
      }
    }, 30);
  }

  // Map selected axis (index into numericAttrs) to original dataset attr index
  const xOrigIdx = numericAttrs[xSel]?.origIdx ?? -1;
  const yOrigIdx = numericAttrs[ySel]?.origIdx ?? -1;

  // Build scatter points grouped by cluster (only when clustering succeeded)
  const scatterByCluster = result && !result.error
    ? Array.from({ length: k }, (_, ki) =>
        dataset.instances
          .map((inst, i) => ({ x: inst[xOrigIdx], y: inst[yOrigIdx], ci: result.assignments[i] }))
          .filter(p => p.ci === ki && p.x !== null && p.y !== null)
      )
    : [];

  // Build centroid scatter points
  const centroidPoints = result && !result.error
    ? result.centroids.map((c, ki) => {
        const cx = result.attrIndices.indexOf(xOrigIdx);
        const cy = result.attrIndices.indexOf(yOrigIdx);
        return { x: c[cx], y: c[cy], ki };
      })
    : [];

  const hasScatter = numericAttrs.length >= 2;

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>

      {/* Controls */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>k-Means</Typography>

          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Clusters (k = {k})
          </Typography>
          <Slider value={k} min={2} max={10} step={1} marks valueLabelDisplay="auto"
            onChange={(_, v) => { setK(v); setResult(null); }} sx={{ mb: 2 }} />

          {hasScatter && (
            <>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Plot axes</Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
                <InputLabel>X axis</InputLabel>
                <Select value={xSel} label="X axis" onChange={e => setXSel(e.target.value)}>
                  {numericAttrs.map((a, i) => <MenuItem key={i} value={i}>{a.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Y axis</InputLabel>
                <Select value={ySel} label="Y axis" onChange={e => setYSel(e.target.value)}>
                  {numericAttrs.map((a, i) => <MenuItem key={i} value={i}>{a.name}</MenuItem>)}
                </Select>
              </FormControl>
            </>
          )}

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            {numericAttrs.length} numeric attribute{numericAttrs.length !== 1 ? 's' : ''} available
          </Typography>

          <Button variant="contained" fullWidth onClick={runCluster} disabled={running}
            startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
            sx={{ bgcolor: '#00796B', '&:hover': { bgcolor: '#00695C' } }}>
            {running ? 'Running…' : 'Cluster'}
          </Button>

          {result && !result.error && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" fontWeight={700} display="block">Results</Typography>
              <Typography variant="caption" display="block">Iterations: {result.iterations}</Typography>
              <Typography variant="caption" display="block">WCSS: {result.wcss}</Typography>
              {result.sizes.map((s, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <Typography variant="caption">Cluster {i}: {s} instances</Typography>
                </Box>
              ))}
            </Box>
          )}
          {result?.error && (
            <Typography variant="caption" color="error" display="block" mt={1}>{result.error}</Typography>
          )}
        </Paper>
      </Grid>

      {/* Right panel: scatter + centroid table */}
      <Grid size={{ xs: 12, md: 9 }}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {hasScatter
              ? `${numericAttrs[xSel]?.name} vs ${numericAttrs[ySel]?.name}`
              : 'Cluster assignments'}
            {result && <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              — ◎ centroids
            </Typography>}
          </Typography>

          {!hasScatter ? (
            <Box sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography>Need at least 2 numeric attributes to plot.</Typography>
            </Box>
          ) : !result ? (
            <Box sx={{ height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography>Run clustering to see assignments.</Typography>
            </Box>
          ) : (
            <Box sx={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: 28, left: 8 }}>
                  <XAxis dataKey="x" type="number" tick={{ fontSize: 10 }}
                    label={{ value: numericAttrs[xSel]?.name, position: 'insideBottom', offset: -14, fontSize: 12 }} />
                  <YAxis dataKey="y" type="number" tick={{ fontSize: 10 }}
                    label={{ value: numericAttrs[ySel]?.name, angle: -90, position: 'insideLeft', fontSize: 12 }} />
                  <ZAxis range={[18, 18]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }}
                    formatter={(v) => [v?.toFixed ? v.toFixed(3) : v]} />
                  <Legend />
                  {/* Instance points per cluster */}
                  {scatterByCluster.map((pts, ki) => (
                    <Scatter key={ki} name={`Cluster ${ki}`} data={pts}
                      fill={COLORS[ki % COLORS.length]} opacity={0.75} />
                  ))}
                  {/* Centroid markers — one per cluster, no legend entry */}
                  {centroidPoints.map((cp, ki) => (
                    <Scatter key={`c${ki}`} data={[cp]} legendType="none"
                      shape={props => <CentroidDot cx={props.cx} cy={props.cy} fill={COLORS[ki % COLORS.length]} />} />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>

        {/* Centroid table */}
        {result && !result.error && (
          <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 1.5, bgcolor: '#004D40', color: '#fff' }}>
              <Typography variant="subtitle2" fontWeight={700}>Cluster Centroids</Typography>
            </Box>
            <Box sx={{ overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                    <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Cluster</TableCell>
                    {result.attrNames.map(n => (
                      <TableCell key={n} sx={{ fontSize: 12, fontWeight: 700 }}>{n}</TableCell>
                    ))}
                    <TableCell sx={{ fontSize: 12, fontWeight: 700 }}>Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.centroids.map((c, ki) => (
                    <TableRow key={ki} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[ki % COLORS.length] }} />
                          <Typography variant="caption" fontWeight={600}>{ki}</Typography>
                        </Box>
                      </TableCell>
                      {c.map((v, j) => (
                        <TableCell key={j} sx={{ fontSize: 12, fontFamily: 'monospace' }}>
                          {v.toFixed(3)}
                        </TableCell>
                      ))}
                      <TableCell sx={{ fontSize: 12 }}>{result.sizes[ki]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        )}
      </Grid>

    </Grid>
  );
}
