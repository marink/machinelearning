"use client";

import { useState, useRef } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button, Tabs, Tab, Paper,
  Menu, MenuItem, ButtonGroup, Chip, Stack, Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DatasetIcon from '@mui/icons-material/Dataset';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { autoparse } from '@lib/parser';
import PreprocessTab from './PreprocessTab';
import ClassifyTab from './ClassifyTab';
import ClusterTab from './ClusterTab';
import VisualizeTab from './VisualizeTab';

const SAMPLE_DATASETS = ['iris.arff', 'weather.arff'];

export default function ExplorerShell() {
  const [tab, setTab]         = useState(0);
  const [dataset, setDataset] = useState(null);
  const [dsName, setDsName]   = useState('');
  const [error, setError]     = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const fileRef = useRef();

  async function loadFile(file) {
    try {
      const text = await file.text();
      const ds = autoparse(text, file.name);
      setDataset(ds);
      setDsName(file.name);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadSample(name) {
    try {
      const res = await fetch(`/datasets/${name}`);
      if (!res.ok) throw new Error(`Could not fetch ${name}`);
      const text = await res.text();
      const ds = autoparse(text, name);
      setDataset(ds);
      setDsName(name);
      setError('');
    } catch (e) {
      setError(e.message);
    }
    setAnchorEl(null);
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  const tabs = ['Preprocess', 'Classify', 'Cluster', 'Visualize'];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top AppBar */}
      <AppBar position="static" elevation={0}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Button component={Link} href="/" color="inherit" size="small" startIcon={<HomeIcon />} sx={{ mr: 1 }}>
            Home
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px', flexGrow: 1 }}>
            Explorer
          </Typography>

          {/* Upload */}
          <input ref={fileRef} type="file" accept=".arff,.csv" hidden onChange={onFileChange} />
          <ButtonGroup size="small" variant="outlined" sx={{ '& .MuiButton-root': { color: '#fff', borderColor: 'rgba(255,255,255,0.4)' } }}>
            <Button startIcon={<UploadFileIcon />} onClick={() => fileRef.current.click()}>
              Open file
            </Button>
            <Button startIcon={<DatasetIcon />} endIcon={<ArrowDropDownIcon />}
              onClick={e => setAnchorEl(e.currentTarget)}>
              Sample
            </Button>
          </ButtonGroup>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {SAMPLE_DATASETS.map(n => (
              <MenuItem key={n} onClick={() => loadSample(n)} sx={{ fontFamily: 'monospace', fontSize: 13 }}>{n}</MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Dataset status bar */}
      {(dataset || error) && (
        <Box sx={{ px: 2, py: 0.5, bgcolor: error ? '#FFEBEE' : '#E0F2F1', borderBottom: '1px solid', borderColor: error ? '#EF9A9A' : '#B2DFDB' }}>
          {error
            ? <Typography variant="caption" color="error">{error}</Typography>
            : (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" fontFamily="monospace" fontWeight={700}>{dsName}</Typography>
                <Chip label={`${dataset.instances.length} instances`} size="small" color="primary" sx={{ height: 18, fontSize: 11 }} />
                <Chip label={`${dataset.attributes.length} attributes`} size="small" sx={{ height: 18, fontSize: 11 }} />
                <Chip label={`class: ${dataset.attributes[dataset.classIndex]?.name}`} size="small" color="secondary" sx={{ height: 18, fontSize: 11 }} />
              </Stack>
            )
          }
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ bgcolor: '#fff', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
          {tabs.map((t, i) => <Tab key={i} label={t} />)}
        </Tabs>
      </Box>

      {/* Tab content — drag-drop zone */}
      <Box
        sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#FAFAFA' }}
        onDragOver={e => e.preventDefault()}
        onDrop={onDrop}
      >
        {!dataset && !error && (
          <Box sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6" gutterBottom>Load a dataset to get started</Typography>
            <Typography variant="body2">
              Drop a <strong>.arff</strong> or <strong>.csv</strong> file here, use <em>Open file</em>, or pick a sample dataset above.
            </Typography>
          </Box>
        )}
        {tab === 0 && <PreprocessTab dataset={dataset} />}
        {tab === 1 && <ClassifyTab dataset={dataset} />}
        {tab === 2 && <ClusterTab dataset={dataset} />}
        {tab === 3 && <VisualizeTab dataset={dataset} />}
      </Box>
    </Box>
  );
}
