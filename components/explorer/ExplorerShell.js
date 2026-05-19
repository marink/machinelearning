"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button, Tabs, Tab, Paper,
  Menu, MenuItem, ButtonGroup, Chip, Stack, Divider,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DatasetIcon from '@mui/icons-material/Dataset';
import HistoryIcon from '@mui/icons-material/History';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpCenter';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { autoparse } from '@lib/parser';
import db from '@lib/db';
import PreprocessTab from './PreprocessTab';
import DataTab from './DataTab';
import ClassifyTab from './ClassifyTab';
import ClusterTab from './ClusterTab';
import VisualizeTab from './VisualizeTab';

const SAMPLE_DATASETS = [
  { label: 'Book examples',    items: ['iris.arff', 'weather.arff', 'contact-lenses.arff', 'labor.arff'] },
  { label: 'UCI classics',     items: ['diabetes.arff', 'vote.arff', 'glass.arff', 'ionosphere.arff', 'segment-challenge.arff'] },
  { label: 'Bayesian Networks', items: ['eczema.arff'] },
];

export default function ExplorerShell() {
  const [tab, setTab]           = useState(0);
  const [dataset, setDataset]   = useState(null);
  const [dsName, setDsName]     = useState('');
  const [error, setError]       = useState('');
  const [restored, setRestored] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bnExport, setBnExport] = useState(null);
  const [nnExport, setNnExport] = useState(null);
  const fileRef = useRef();

  // Restore last session and populate recent list on mount
  useEffect(() => {
    db.recent.orderBy('savedAt').reverse().limit(5).toArray().then(entries => {
      if (!entries.length) return;
      setRecentFiles(entries.map(e => e.name));
      // Restore the most recent dataset
      const { name, attributes, instances, classIndex } = entries[0];
      setDataset({ attributes, instances, classIndex });
      setDsName(name);
      setRestored(true);
    }).catch(() => {});
  }, []);

  async function persist(ds, name) {
    try {
      await db.recent.put({ name, ...ds, savedAt: Date.now() });
      const all = await db.recent.orderBy('savedAt').reverse().toArray();
      if (all.length > 5) await db.recent.bulkDelete(all.slice(5).map(r => r.name));
      setRecentFiles(all.slice(0, 5).map(e => e.name));
    } catch (e) { /* silently ignore — IDB may be unavailable in private browsing */ }
  }

  async function loadFile(file) {
    try {
      const text = await file.text();
      const ds = autoparse(text, file.name);
      setDataset(ds); setBnExport(null); setNnExport(null);
      setDsName(file.name);
      setError('');
      setRestored(false);
      persist(ds, file.name);
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
      setDataset(ds); setBnExport(null); setNnExport(null);
      setDsName(name);
      setError('');
      setRestored(false);
      persist(ds, name);
    } catch (e) {
      setError(e.message);
    }
    setAnchorEl(null);
  }

  async function loadRecent(name) {
    try {
      const entry = await db.recent.get(name);
      if (entry) {
        const { attributes, instances, classIndex } = entry;
        setDataset({ attributes, instances, classIndex }); setBnExport(null); setNnExport(null);
        setDsName(name);
        setError('');
        setRestored(false);
      }
    } catch (e) {
      setError('Could not load from cache');
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

  const tabs = ['Preprocess', 'Data', 'Classify', 'Cluster', 'Visualize'];

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
            {/* Recent files */}
            {recentFiles.length > 0 && [
              <MenuItem key="recent-hdr" disabled sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', py: 0.5, minHeight: 0 }}>
                Recent
              </MenuItem>,
              ...recentFiles.map(name => (
                <MenuItem key={`r-${name}`} onClick={() => loadRecent(name)}
                  sx={{ fontFamily: 'monospace', fontSize: 13, pl: 2.5, gap: 1 }}>
                  <HistoryIcon sx={{ fontSize: 14, color: 'rgba(0,0,0,0.35)' }} />{name}
                </MenuItem>
              )),
              <Divider key="recent-div" />,
            ]}

            {/* Sample datasets */}
            {SAMPLE_DATASETS.map(({ label, items }, gi) => [
              gi > 0 && <Divider key={`div-${gi}`} />,
              <MenuItem key={label} disabled sx={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase', py: 0.5, minHeight: 0 }}>
                {label}
              </MenuItem>,
              ...items.map(n => (
                <MenuItem key={n} onClick={() => loadSample(n)} sx={{ fontFamily: 'monospace', fontSize: 13, pl: 2.5 }}>{n}</MenuItem>
              )),
            ])}
          </Menu>

          <Tooltip title="Dataset reference">
            <IconButton component={Link} href="/docs/datasets/" size="small" sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff' } }}>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Dataset status bar */}
      {(dataset || error) && (
        <Box sx={{ px: 2, py: 0.5, bgcolor: error ? '#FFEBEE' : '#E3F0FF', borderBottom: '1px solid', borderColor: error ? '#EF9A9A' : '#BBDEFB' }}>
          {error
            ? <Typography variant="caption" color="error">{error}</Typography>
            : (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography variant="caption" fontFamily="monospace" fontWeight={700}>{dsName}</Typography>
                <Chip label={`${dataset.instances.length} instances`} size="small" color="primary" sx={{ height: 18, fontSize: 11 }} />
                <Chip label={`${dataset.attributes.length} attributes`} size="small" sx={{ height: 18, fontSize: 11 }} />
                <Chip label={`class: ${dataset.attributes[dataset.classIndex]?.name}`} size="small" color="secondary" sx={{ height: 18, fontSize: 11 }} />
                {restored && (
                  <Chip icon={<HistoryIcon sx={{ fontSize: '12px !important' }} />} label="restored" size="small"
                    sx={{ height: 18, fontSize: 11, bgcolor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.5)' }} />
                )}
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
        {tab === 1 && <DataTab dataset={dataset} />}
        {tab === 2 && <ClassifyTab dataset={dataset} onBnExport={setBnExport} onNnExport={setNnExport} />}
        {tab === 3 && <ClusterTab dataset={dataset} />}
        {tab === 4 && <VisualizeTab dataset={dataset} bnExport={bnExport} nnExport={nnExport} />}
      </Box>
    </Box>
  );
}
