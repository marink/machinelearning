"use client";

import { useState, useEffect, useRef, useReducer } from 'react';
import { forceSimulation, forceManyBody, forceLink, forceCenter, forceCollide } from 'd3-force';
import {
  Box, Typography, Paper, Grid, FormControl, InputLabel, Select, MenuItem,
  ToggleButton, ToggleButtonGroup, Chip,
} from '@mui/material';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend,
  BarChart, Bar, Cell, ResponsiveContainer,
} from 'recharts';
import { histogramBins } from '@lib/stats';

const COLORS = ['#00897B','#F57F17','#1565C0','#AD1457','#6A1B9A','#2E7D32','#795548','#E64A19'];
const TEAL   = '#00897B';
const R_NODE = 20; // BN node radius

// ── Inline Bayesian Network graph (d3-force, draggable, read-only) ────────────

function BnGraph({ bnExport }) {
  const svgRef  = useRef(null);
  const simRef  = useRef(null);
  const nodesRef = useRef([]);
  const dragRef  = useRef(null);
  const [, rerender] = useReducer(x => x + 1, 0);

  // Build node/edge lists from bnExport
  const nodeList = bnExport.attributes.map((a, i) => ({
    id: `a${i}`, label: a.name,
    isClass: i === bnExport.classIndex,
  }));
  const edgeList = [];
  for (const [toStr, parents] of Object.entries(bnExport.structure)) {
    for (const from of parents) {
      edgeList.push({ id: `e${from}_${toStr}`, from: `a${from}`, to: `a${Number(toStr)}` });
    }
  }

  useEffect(() => {
    const svg = svgRef.current;
    const W = svg?.clientWidth ?? 680, H = svg?.clientHeight ?? 380;
    const n = nodeList.length;

    // Initialise sim-node positions on a circle
    nodesRef.current = nodeList.map((nd, i) => ({
      id: nd.id,
      x: W / 2 + Math.cos((i / n) * 2 * Math.PI) * 140,
      y: H / 2 + Math.sin((i / n) * 2 * Math.PI) * 140,
    }));

    if (simRef.current) simRef.current.stop();
    const sim = forceSimulation(nodesRef.current)
      .force('charge',  forceManyBody().strength(-600))
      .force('link',    forceLink(edgeList.map(e => ({ source: e.from, target: e.to }))).id(d => d.id).distance(110).strength(0.6))
      .force('center',  forceCenter(W / 2, H / 2).strength(0.05))
      .force('collide', forceCollide(R_NODE + 18))
      .alphaDecay(0.025)
      .on('tick', () => rerender());
    simRef.current = sim;
    return () => sim.stop();
  }, [bnExport]); // eslint-disable-line react-hooks/exhaustive-deps

  function pt(e) {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e, id) {
    e.stopPropagation();
    dragRef.current = id;
    const n = nodesRef.current.find(n => n.id === id);
    if (n) { n.fx = n.x; n.fy = n.y; }
    simRef.current?.alphaTarget(0.3).restart();
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const p = pt(e);
    const n = nodesRef.current.find(n => n.id === dragRef.current);
    if (n) { n.fx = p.x; n.fy = p.y; }
    simRef.current?.alpha(0.3).restart();
  }

  function handlePointerUp() {
    if (!dragRef.current) return;
    const n = nodesRef.current.find(n => n.id === dragRef.current);
    if (n) { n.fx = null; n.fy = null; }
    simRef.current?.alphaTarget(0).restart();
    dragRef.current = null;
  }

  const byId = Object.fromEntries(nodesRef.current.map(n => [n.id, n]));

  function edgePts(e) {
    const s = byId[e.from], t = byId[e.to];
    if (!s || !t) return null;
    const dx = t.x - s.x, dy = t.y - s.y, d = Math.hypot(dx, dy) || 1;
    return {
      x1: s.x + (dx / d) * R_NODE,
      y1: s.y + (dy / d) * R_NODE,
      x2: t.x - (dx / d) * (R_NODE + 8),
      y2: t.y - (dy / d) * (R_NODE + 8),
    };
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <svg ref={svgRef} width="100%" height={380} style={{ display: 'block', cursor: 'default', touchAction: 'none' }}
        onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
        <defs>
          <marker id="vt-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#78909C" />
          </marker>
        </defs>

        {/* Edges */}
        {edgeList.map(e => {
          const p = edgePts(e);
          if (!p) return null;
          return (
            <line key={e.id}
              x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
              stroke="#78909C" strokeWidth={1.5}
              markerEnd="url(#vt-arrow)" />
          );
        })}

        {/* Nodes */}
        {nodeList.map(nd => {
          const pos = byId[nd.id];
          if (!pos) return null;
          return (
            <g key={nd.id}
              onPointerDown={e => handlePointerDown(e, nd.id)}
              style={{ cursor: 'grab' }}>
              <circle cx={pos.x} cy={pos.y} r={R_NODE}
                fill={nd.isClass ? '#E8F5E9' : '#E3F0FF'}
                stroke={nd.isClass ? '#2e7d32' : '#1565C0'}
                strokeWidth={nd.isClass ? 2 : 1.5} />
              <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fontWeight={nd.isClass ? 700 : 400} fill="#263238"
                style={{ userSelect: 'none', pointerEvents: 'none' }}>
                {nd.label.length > 11 ? nd.label.slice(0, 10) + '…' : nd.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Footer */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #2e7d32', bgcolor: '#E8F5E9' }} />
          <Typography variant="caption" color="text.secondary">class</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>drag nodes to explore</Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: '#1565C0' }}>
          Full interactive builder →{' '}
          <a href="https://probabilistic.net" target="_blank" rel="noreferrer"
            style={{ color: '#1565C0', fontWeight: 600 }}>probabilistic.net</a>
        </Typography>
      </Box>
    </Box>
  );
}

// ── Inline Neural Network weight diagram ──────────────────────────────────────

function NnGraph({ nnExport }) {
  const { layerSizes, inputNames, outputNames, W1, W2 } = nnExport;
  const [nI, nH, nO] = layerSizes;

  const allW  = [...W1, ...W2];
  const maxAbs = Math.max(...allW.map(Math.abs), 0.01);

  function wColor(w) {
    const t = Math.abs(w) / maxAbs;
    const alpha = (0.06 + t * 0.55).toFixed(2);
    return w > 0 ? `rgba(180,40,40,${alpha})` : `rgba(40,80,200,${alpha})`;
  }

  // Adaptive layout
  const maxN   = Math.max(nI, nH, nO);
  const rowH   = Math.max(14, Math.min(34, Math.floor(400 / maxN)));
  const nodeR  = Math.max(4, Math.min(10, Math.floor(rowH * 0.42)));
  const svgH   = maxN * rowH + 52;
  const W      = 620;
  const xI = 70, xH = W / 2, xO = W - 70;

  function nodeY(idx, total) {
    const span = total * rowH;
    return (svgH - 40) / 2 - span / 2 + idx * rowH + rowH / 2;
  }

  const inputY  = Array.from({ length: nI }, (_, i) => nodeY(i, nI));
  const hiddenY = Array.from({ length: nH }, (_, h) => nodeY(h, nH));
  const outputY = Array.from({ length: nO }, (_, c) => nodeY(c, nO));

  // Truncate long labels
  function label(s, max = 12) { return s.length > max ? s.slice(0, max - 1) + '…' : s; }

  const showW1 = nI * nH <= 600;
  const showW2 = nH * nO <= 200;

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <svg width={W} height={svgH} style={{ display: 'block', margin: '0 auto' }}>

        {/* W1: input → hidden */}
        {showW1 && Array.from({ length: nH }, (_, h) =>
          Array.from({ length: nI }, (_, j) => (
            <line key={`w1-${h}-${j}`}
              x1={xI} y1={inputY[j]} x2={xH} y2={hiddenY[h]}
              stroke={wColor(W1[h * nI + j])} strokeWidth={0.9}>
              <title>{W1[h * nI + j].toFixed(3)}</title>
            </line>
          ))
        )}

        {/* W2: hidden → output */}
        {showW2 && Array.from({ length: nO }, (_, c) =>
          Array.from({ length: nH }, (_, h) => (
            <line key={`w2-${c}-${h}`}
              x1={xH} y1={hiddenY[h]} x2={xO} y2={outputY[c]}
              stroke={wColor(W2[c * nH + h])} strokeWidth={1.2}>
              <title>{W2[c * nH + h].toFixed(3)}</title>
            </line>
          ))
        )}

        {/* Input nodes */}
        {inputY.map((y, i) => (
          <g key={`in-${i}`}>
            <circle cx={xI} cy={y} r={nodeR} fill="#E3F0FF" stroke="#1565C0" strokeWidth={1.2} />
            <text x={xI + nodeR + 4} y={y} dominantBaseline="middle" fontSize={Math.max(8, nodeR)}
              fill="#263238" style={{ userSelect: 'none' }}>
              {label(inputNames[i], 16)}
            </text>
          </g>
        ))}

        {/* Hidden nodes */}
        {hiddenY.map((y, h) => (
          <g key={`h-${h}`}>
            <circle cx={xH} cy={y} r={nodeR} fill="#F0EBF8" stroke="#563d7c" strokeWidth={1.2} />
          </g>
        ))}

        {/* Output nodes */}
        {outputY.map((y, c) => (
          <g key={`out-${c}`}>
            <circle cx={xO} cy={y} r={nodeR} fill="#E8F5E9" stroke="#2e7d32" strokeWidth={1.2} />
            <text x={xO - nodeR - 4} y={y} dominantBaseline="middle" textAnchor="end"
              fontSize={Math.max(8, nodeR)} fill="#263238" style={{ userSelect: 'none' }}>
              {label(outputNames[c], 14)}
            </text>
          </g>
        ))}

        {/* Layer labels */}
        {[
          { x: xI, label: `Input (${nI})` },
          { x: xH, label: `Hidden (${nH})` },
          { x: xO, label: `Output (${nO})` },
        ].map(({ x, label: lbl }) => (
          <text key={lbl} x={x} y={svgH - 8} textAnchor="middle" fontSize={11} fill="#78909C">{lbl}</text>
        ))}
      </svg>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 0.5 }}>
        {[
          { color: 'rgba(180,40,40,0.7)', label: 'positive weight' },
          { color: 'rgba(40,80,200,0.7)', label: 'negative weight' },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 22, height: 3, bgcolor: color, borderRadius: 1 }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        ))}
        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>hover connections for weight values</Typography>
      </Box>
    </Box>
  );
}

// ── Network panel (BN or NN) ──────────────────────────────────────────────────

function NetworkPanel({ bnExport, nnExport }) {
  const hasNet = bnExport || nnExport;

  if (!hasNet) {
    return (
      <Box sx={{ height: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', gap: 1 }}>
        <Typography variant="body2" textAlign="center">
          Run <strong>Bayesian Network (K2)</strong>, <strong>Naïve Bayes</strong>, or <strong>Neural Network (MLP)</strong><br />
          in the Classify tab to visualize the network here.
        </Typography>
      </Box>
    );
  }

  if (bnExport) {
    const edgeCount = Object.values(bnExport.structure).flat().length;
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2" fontWeight={700}>Bayesian Network Structure</Typography>
          <Chip label={`${bnExport.attributes.length} nodes`} size="small" sx={{ bgcolor: '#E3F0FF', color: '#1565C0', fontWeight: 600 }} />
          <Chip label={`${edgeCount} edges`} size="small" variant="outlined" />
        </Box>
        <BnGraph bnExport={bnExport} />
      </>
    );
  }

  // NN
  const [nI, nH, nO] = nnExport.layerSizes;
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
        <Typography variant="subtitle2" fontWeight={700}>Neural Network Weights</Typography>
        <Chip label={`${nI} → ${nH} → ${nO}`} size="small" sx={{ fontFamily: 'monospace', bgcolor: '#F0EBF8', color: '#563d7c', fontWeight: 600 }} />
        <Chip label={`${nI * nH + nH * nO} weights`} size="small" variant="outlined" />
      </Box>
      <NnGraph nnExport={nnExport} />
    </>
  );
}

// ── Main VisualizeTab ─────────────────────────────────────────────────────────

export default function VisualizeTab({ dataset, bnExport, nnExport }) {
  const [chartType, setChartType] = useState('scatter');
  const [xAttr, setXAttr]         = useState(0);
  const [yAttr, setYAttr]         = useState(1);
  const [histAttr, setHistAttr]   = useState(0);

  const hasNetwork = !!(bnExport || nnExport);

  useEffect(() => {
    setXAttr(0); setYAttr(1); setHistAttr(0); setChartType('scatter');
  }, [dataset]);

  // Auto-switch away from Network tab if network is cleared
  useEffect(() => {
    if (!hasNetwork && chartType === 'network') setChartType('scatter');
  }, [hasNetwork]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const xI = numericAttrs[xAttr]?.i ?? 0;
  const yI = numericAttrs[yAttr]?.i ?? (numericAttrs[1]?.i ?? 0);

  let scatterContent;
  if (isNumericClass) {
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

  const histI   = allAttrs[histAttr]?.i ?? 0;
  const histSel = allAttrs[histAttr];
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
            <ToggleButton value="scatter"   sx={{ fontSize: 12 }}>Scatter</ToggleButton>
            <ToggleButton value="histogram" sx={{ fontSize: 12 }}>Histogram</ToggleButton>
            {hasNetwork && (
              <ToggleButton value="network" sx={{ fontSize: 12 }}>Network</ToggleButton>
            )}
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
          {chartType === 'network' ? (
            <NetworkPanel bnExport={bnExport} nnExport={nnExport} />
          ) : chartType === 'scatter' ? (
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
