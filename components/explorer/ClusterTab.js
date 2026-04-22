"use client";

import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Grid, Slider, CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { cluster } from '@lib/algorithms/kmeans';

const COLORS = ['#00897B','#F57F17','#1565C0','#AD1457','#6A1B9A','#2E7D32','#795548'];

export default function ClusterTab({ dataset }) {
  const [k, setK]         = useState(3);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset first.</Typography>
      </Box>
    );
  }

  const numericAttrs = dataset.attributes.map((a, i) => i !== dataset.classIndex && a.type === 'numeric' ? a : null).filter(Boolean);

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

  // build scatter data using first two numeric attrs
  const xIdx = numericAttrs[0] ? dataset.attributes.indexOf(numericAttrs[0]) : -1;
  const yIdx = numericAttrs[1] ? dataset.attributes.indexOf(numericAttrs[1]) : -1;
  const scatterPoints = result && xIdx >= 0 && yIdx >= 0
    ? dataset.instances.map((inst, i) => ({
        x: inst[xIdx],
        y: inst[yIdx],
        cluster: result.assignments[i],
      }))
    : [];

  const byCluster = Array.from({ length: k }, (_, ki) => scatterPoints.filter(p => p.cluster === ki));

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={3}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>k-Means</Typography>
          <Typography variant="caption" color="text.secondary" display="block" mb={1}>Number of clusters (k)</Typography>
          <Slider value={k} min={2} max={10} step={1} marks valueLabelDisplay="auto"
            onChange={(_, v) => setK(v)} />
          <Typography variant="caption" color="text.secondary">
            {numericAttrs.length} numeric attribute{numericAttrs.length !== 1 ? 's' : ''} available
          </Typography>

          <Button
            variant="contained" fullWidth startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
            onClick={runCluster} disabled={running}
            sx={{ mt: 2, bgcolor: '#00796B', '&:hover': { bgcolor: '#00695C' } }}
          >
            {running ? 'Running…' : 'Cluster'}
          </Button>

          {result && !result.error && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" display="block" fontWeight={700}>Results</Typography>
              <Typography variant="caption" display="block">Iterations: {result.iterations}</Typography>
              <Typography variant="caption" display="block">WCSS: {result.wcss}</Typography>
              {result.sizes.map((s, i) => (
                <Typography key={i} variant="caption" display="block" sx={{ color: COLORS[i % COLORS.length] }}>
                  Cluster {i}: {s} instances
                </Typography>
              ))}
            </Box>
          )}
          {result?.error && (
            <Typography variant="caption" color="error" display="block" mt={1}>{result.error}</Typography>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={9}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Cluster Assignments — {numericAttrs[0]?.name} vs {numericAttrs[1]?.name || '(need 2 numeric attrs)'}
          </Typography>
          {byCluster.length > 0 ? (
            <Box sx={{ height: 380 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                  <XAxis dataKey="x" name={numericAttrs[0]?.name} tick={{ fontSize: 10 }} label={{ value: numericAttrs[0]?.name, position: 'insideBottom', offset: -2, fontSize: 11 }} />
                  <YAxis dataKey="y" name={numericAttrs[1]?.name} tick={{ fontSize: 10 }} label={{ value: numericAttrs[1]?.name, angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <ZAxis range={[20, 20]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  {byCluster.map((pts, ki) => (
                    <Scatter key={ki} name={`Cluster ${ki}`} data={pts} fill={COLORS[ki % COLORS.length]} opacity={0.8} />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <Typography>Run clustering to see the scatter plot.</Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
