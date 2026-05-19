"use client";

import { useState } from 'react';
import {
  Box, Typography, Button, Paper, Grid, FormControl, InputLabel,
  Select, MenuItem, Slider, CircularProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as knn    from '@lib/algorithms/knn';
import * as nb     from '@lib/algorithms/naiveBayes';
import * as dt     from '@lib/algorithms/decisionTree';
import * as lr     from '@lib/algorithms/logisticRegression';
import * as svm    from '@lib/algorithms/svm';
import * as linreg from '@lib/algorithms/linearRegression';
import * as k2bn   from '@lib/algorithms/k2';
import * as mlp    from '@lib/algorithms/mlp';
import { percentageSplit, stratifiedFolds, computeMetrics, formatResults } from '@lib/evaluation';

const CLASS_ALGORITHMS = {
  'k-NN (k=1)':            { key: 'knn', k: 1 },
  'k-NN (k=3)':            { key: 'knn', k: 3 },
  'k-NN (k=5)':            { key: 'knn', k: 5 },
  'Naïve Bayes':           { key: 'nb' },
  'Decision Tree (ID3)':   { key: 'dt' },
  'Logistic Regression':   { key: 'lr' },
  'SVM':                   { key: 'svm' },
  'Neural Network (MLP)':  { key: 'mlp' },
  'Bayesian Network (K2)': { key: 'k2' },
};

const REG_ALGORITHMS = {
  'Linear Regression': { key: 'linreg' },
};

function randomFolds(ds, k) {
  const shuffled = [...ds.instances].sort(() => Math.random() - 0.5);
  const folds = Array.from({ length: k }, () => []);
  shuffled.forEach((inst, i) => folds[i % k].push(inst));
  return folds.map((_, fi) => ({
    train: { ...ds, instances: folds.flatMap((f, i) => i !== fi ? f : []) },
    test:  { ...ds, instances: folds[fi] },
  }));
}

function formatRegressionResults(m, algorithmName, testMode, n) {
  let out = `=== Run information ===\n`;
  out += `Scheme:    ${algorithmName}\n`;
  out += `Test mode: ${testMode}\n\n`;
  out += `=== Summary ===\n\n`;
  out += `Instances                         ${String(n).padStart(6)}\n`;
  out += `Correlation coefficient (R²)      ${m.r2.toFixed(4).padStart(8)}\n`;
  out += `Mean absolute error (MAE)         ${m.mae.toFixed(4).padStart(8)}\n`;
  out += `Root mean squared error (RMSE)    ${m.rmse.toFixed(4).padStart(8)}\n`;
  return out;
}

export default function ClassifyTab({ dataset, onBnExport, onNnExport }) {
  const [classAlgo, setClassAlgo] = useState('k-NN (k=1)');
  const [regAlgo,   setRegAlgo]   = useState('Linear Regression');
  const [mode,      setMode]      = useState('cv10');
  const [splitPct,  setSplitPct]  = useState(66);
  const [output,    setOutput]    = useState('');
  const [running,   setRunning]   = useState(false);
  const [bnExport,     setBnExport]     = useState(null);
  const [networkReady, setNetworkReady] = useState(false);

  function exportBn(val) { setBnExport(val); onBnExport?.(val); if (val) { onNnExport?.(null); setNetworkReady(true); } else setNetworkReady(false); }
  function exportNn(val) { onNnExport?.(val); if (val) { setBnExport(null); onBnExport?.(null); setNetworkReady(true); } else setNetworkReady(false); }

  if (!dataset) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography>Load a dataset first.</Typography>
      </Box>
    );
  }

  const classAttr   = dataset.attributes[dataset.classIndex];
  const isRegression = classAttr?.type === 'numeric';
  const ALGORITHMS   = isRegression ? REG_ALGORITHMS : CLASS_ALGORITHMS;
  const algo         = isRegression ? regAlgo : classAlgo;
  const setAlgo      = isRegression ? setRegAlgo : setClassAlgo;

  const classValues = isRegression
    ? []
    : (classAttr?.values ?? [...new Set(dataset.instances.map(i => i[dataset.classIndex]).filter(v => v !== null))]);

  function getHandlers() {
    if (isRegression) return { trainFn: linreg.train, predictFn: linreg.predict };
    const cfg = ALGORITHMS[algo];
    switch (cfg.key) {
      case 'knn': return { trainFn: knn.train,  classifyFn: (m, i) => knn.classify(m, i, cfg.k) };
      case 'nb':  return { trainFn: nb.train,   classifyFn: nb.classify };
      case 'dt':  return { trainFn: dt.train,   classifyFn: dt.classify };
      case 'lr':  return { trainFn: lr.train,   classifyFn: lr.classify };
      case 'svm': return { trainFn: svm.train,  classifyFn: svm.classify };
      case 'mlp': return { trainFn: mlp.train,  classifyFn: mlp.classify };
      case 'k2':  return { trainFn: k2bn.train, classifyFn: k2bn.classify };
    }
  }

  function run() {
    setRunning(true);
    setTimeout(() => {
      try {
        const { trainFn, classifyFn, predictFn } = getHandlers();
        const infer = isRegression ? predictFn : classifyFn;
        let allPreds = [], allActuals = [];

        if (mode === 'train') {
          const model = trainFn(dataset);
          for (const inst of dataset.instances) {
            allPreds.push(infer(model, inst));
            allActuals.push(inst[dataset.classIndex]);
          }
        } else if (mode === 'pct') {
          const { train, test } = percentageSplit(dataset, splitPct);
          const model = trainFn(train);
          for (const inst of test.instances) {
            allPreds.push(infer(model, inst));
            allActuals.push(inst[dataset.classIndex]);
          }
        } else {
          const k = parseInt(mode.replace('cv', ''));
          const foldSets = isRegression ? randomFolds(dataset, k) : stratifiedFolds(dataset, k);
          for (const { train, test } of foldSets) {
            const model = trainFn(train);
            for (const inst of test.instances) {
              allPreds.push(infer(model, inst));
              allActuals.push(inst[dataset.classIndex]);
            }
          }
        }

        const modeLabel = mode === 'train' ? 'Training set'
          : mode === 'pct' ? `${splitPct}% split`
          : `${mode.replace('cv', '')}-fold cross-validation`;

        if (isRegression) {
          setOutput(formatRegressionResults(linreg.metrics(allPreds, allActuals), algo, modeLabel, allPreds.length));
          exportBn(null);
        } else {
          setOutput(formatResults(computeMetrics(allPreds, allActuals, classValues), classValues, algo, modeLabel));
          const algoKey = ALGORITHMS[algo]?.key;
          if (algoKey === 'k2') {
            exportBn(k2bn.train(dataset));
          } else if (algoKey === 'nb') {
            const ci = dataset.classIndex;
            const structure = {};
            dataset.attributes.forEach((_, i) => { structure[i] = i === ci ? [] : [ci]; });
            exportBn({ attributes: dataset.attributes, structure });
          } else if (algoKey === 'mlp') {
            const m = mlp.train(dataset);
            exportNn({ layerSizes: m.layerSizes, inputNames: m.inputNames, outputNames: m.outputNames, W1: m.W1, W2: m.W2 });
          } else {
            exportBn(null); exportNn(null);
          }
        }
      } catch (e) {
        setOutput(`Error: ${e.message}`);
        exportBn(null); exportNn(null);
      } finally {
        setRunning(false);
      }
    }, 30);
  }

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {isRegression ? 'Regressor' : 'Classifier'}
          </Typography>
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
            variant="contained" fullWidth
            startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
            onClick={run} disabled={running}
            sx={{ mt: 2, bgcolor: '#00796B', '&:hover': { bgcolor: '#00695C' } }}
          >
            {running ? 'Running…' : 'Start'}
          </Button>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 1.5, bgcolor: '#004D40', color: '#fff' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              {isRegression ? 'Regressor output' : 'Classifier output'}
            </Typography>
          </Box>
          <Box className="output-panel" sx={{ minHeight: 320, maxHeight: 480, borderRadius: 0 }}>
            {output || 'Results will appear here after running…'}
          </Box>
        </Paper>

        {networkReady && (
          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              → Visualize tab → Network to explore the learned structure
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
