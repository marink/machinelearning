"use client";

import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Grid, FormControl, InputLabel,
  Select, MenuItem, Slider, CircularProgress, TextField,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as knn from '@lib/algorithms/knn';
import * as nb from '@lib/algorithms/naiveBayes';
import { percentageSplit, stratifiedFolds, computeMetrics, formatResults } from '@lib/evaluation';

const ALGORITHMS = {
  'k-NN (k=1)':  { key: 'knn', k: 1 },
  'k-NN (k=3)':  { key: 'knn', k: 3 },
  'k-NN (k=5)':  { key: 'knn', k: 5 },
  'Naïve Bayes': { key: 'nb' },
};

export default function ClassifyTab({ dataset }) {
  const [algo, setAlgo]     = useState('k-NN (k=1)');
  const [mode, setMode]     = useState('cv10');
  const [splitPct, setSplitPct] = useState(66);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset first.</Typography>
      </Box>
    );
  }

  const classAttr = dataset.attributes[dataset.classIndex];
  const classValues = classAttr?.values ?? [...new Set(dataset.instances.map(i => i[dataset.classIndex]).filter(v => v !== null))];

  function runClassifier() {
    setRunning(true);
    setTimeout(() => {
      try {
        const cfg = ALGORITHMS[algo];
        const classify = cfg.key === 'knn'
          ? (model, inst) => knn.classify(model, inst, cfg.k)
          : nb.classify;
        const trainFn = cfg.key === 'knn' ? knn.train : nb.train;

        let allPreds = [], allActuals = [];

        if (mode === 'train') {
          const model = trainFn(dataset);
          for (const inst of dataset.instances) {
            allPreds.push(classify(model, inst));
            allActuals.push(inst[dataset.classIndex]);
          }
        } else if (mode === 'pct') {
          const { train, test } = percentageSplit(dataset, splitPct);
          const model = trainFn(train);
          for (const inst of test.instances) {
            allPreds.push(classify(model, inst));
            allActuals.push(inst[dataset.classIndex]);
          }
        } else {
          const folds = parseInt(mode.replace('cv', ''));
          for (const { train, test } of stratifiedFolds(dataset, folds)) {
            const model = trainFn(train);
            for (const inst of test.instances) {
              allPreds.push(classify(model, inst));
              allActuals.push(inst[dataset.classIndex]);
            }
          }
        }

        const metrics = computeMetrics(allPreds, allActuals, classValues);
        const modeLabel = mode === 'train' ? 'Training set'
          : mode === 'pct' ? `${splitPct}% split`
          : `${mode.replace('cv', '')}-fold cross-validation`;

        setOutput(formatResults(metrics, classValues, algo, modeLabel));
      } catch (e) {
        setOutput(`Error: ${e.message}`);
      } finally {
        setRunning(false);
      }
    }, 30);
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={4}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>Classifier</Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Algorithm</InputLabel>
            <Select value={algo} label="Algorithm" onChange={e => setAlgo(e.target.value)}>
              {Object.keys(ALGORITHMS).map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mt: 2 }}>Test Options</Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Test mode</InputLabel>
            <Select value={mode} label="Test mode" onChange={e => setMode(e.target.value)}>
              <MenuItem value="cv10">10-fold cross-validation</MenuItem>
              <MenuItem value="cv5">5-fold cross-validation</MenuItem>
              <MenuItem value="pct">Percentage split</MenuItem>
              <MenuItem value="train">Use training set</MenuItem>
            </Select>
          </FormControl>

          {mode === 'pct' && (
            <Box sx={{ px: 1 }}>
              <Typography variant="caption">Training: {splitPct}%</Typography>
              <Slider value={splitPct} min={50} max={90} step={5}
                onChange={(_, v) => setSplitPct(v)} marks size="small" />
            </Box>
          )}

          <Button
            variant="contained" fullWidth startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
            onClick={runClassifier} disabled={running}
            sx={{ mt: 2, bgcolor: '#00796B', '&:hover': { bgcolor: '#00695C' } }}
          >
            {running ? 'Running…' : 'Start'}
          </Button>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 1.5, bgcolor: '#004D40', color: '#fff' }}>
            <Typography variant="subtitle2" fontWeight={700}>Classifier output</Typography>
          </Box>
          <Box className="output-panel" sx={{ minHeight: 320, maxHeight: 480, borderRadius: 0 }}>
            {output || 'Results will appear here after running…'}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
