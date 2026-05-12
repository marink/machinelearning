"use client";

import { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, IconButton, Container, Chip, Paper, Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ScienceIcon from '@mui/icons-material/Science';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InfoIcon from '@mui/icons-material/Info';
import TableChartIcon from '@mui/icons-material/TableChart';
import StorageIcon from '@mui/icons-material/Storage';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Link from 'next/link';

const DRAWER_WIDTH = 240;
const MINI_WIDTH = 52;

/* Apple-style nav link */
const NAV_LINK = {
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(44,44,44,0.8)',
  textDecoration: 'none',
  mx: 1.5,
  '&:hover': { color: '#000' },
};

const sections = [
  { id: 'overview',   label: 'Overview',    icon: <InfoIcon fontSize="small" /> },
  { id: 'knn',        label: 'k-NN',        icon: <AccountTreeIcon fontSize="small" /> },
  { id: 'naivebayes', label: 'Naïve Bayes', icon: <ScienceIcon fontSize="small" /> },
  { id: 'kmeans',     label: 'k-Means',     icon: <BubbleChartIcon fontSize="small" /> },
  { id: 'arff',       label: 'ARFF Format', icon: <InsertDriveFileIcon fontSize="small" /> },
  { id: 'csv',        label: 'CSV Format',  icon: <TableChartIcon fontSize="small" /> },
  { id: 'datasets',   label: 'Datasets',    icon: <StorageIcon fontSize="small" /> },
];

function Code({ children }) {
  return (
    <Paper variant="outlined" sx={{
      p: 2, my: 2,
      fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
      fontSize: 13,
      bgcolor: '#F5F5F7',
      whiteSpace: 'pre',
      overflowX: 'auto',
      borderColor: 'rgba(0,0,0,0.1)',
      borderRadius: 2,
    }}>
      {children}
    </Paper>
  );
}

function Section({ id, title, children }) {
  return (
    <Box id={id} sx={{ mb: 7, scrollMarginTop: '80px' }}>
      <Typography sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3, borderColor: 'rgba(0,0,0,0.1)' }} />
      {children}
    </Box>
  );
}

function Para({ children }) {
  return (
    <Typography sx={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', mb: 2 }}>
      {children}
    </Typography>
  );
}

function SubHead({ children }) {
  return (
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', mb: 1, mt: 2 }}>
      {children}
    </Typography>
  );
}

function StepLabel({ n, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5, mb: 0.5 }}>
      <Box sx={{
        width: 22, height: 22, borderRadius: '50%', bgcolor: '#1565C0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{n}</Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{label}</Typography>
    </Box>
  );
}

function Citation({ title, authors, venue, year, url, note }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: 'rgba(21,101,192,0.35)', bgcolor: '#F0F4FF', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <MenuBookIcon sx={{ color: '#1565C0', mt: 0.25, flexShrink: 0, fontSize: 20 }} />
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', mb: 0.25, fontStyle: 'italic' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', mb: 0.75 }}>
            {authors} · {venue} · {year}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href={url} target="_blank" rel="noreferrer"
              style={{ color: '#1565C0', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              View paper →
            </a>
            {note && (
              <Typography component="span" sx={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
                {note}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function DocsPage() {
  const [open, setOpen] = useState(true);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>

      {/* Apple-style frosted glass AppBar */}
      <AppBar position="fixed" elevation={0} sx={{
        bgcolor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        color: 'rgba(0,0,0,0.8)',
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundImage: 'none',
      }}>
        <Toolbar variant="dense" sx={{ maxWidth: 980 + DRAWER_WIDTH, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 }, minHeight: '44px !important' }}>
          <IconButton
            onClick={() => setOpen(o => !o)}
            edge="start"
            sx={{ mr: 1, color: 'rgba(44,44,44,0.8)' }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Box component={Link} href="/" sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            textDecoration: 'none', mr: 2,
          }}>
            <ScienceIcon sx={{ fontSize: 18, color: '#1565C0' }} />
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
              MachineLearning.js
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {[
              { label: 'Home',     href: '/' },
              { label: 'Explorer', href: '/explorer/' },
              { label: 'About',    href: '/about/' },
            ].map(({ label, href }) => (
              <Box key={label} component={Link} href={href} sx={NAV_LINK}>{label}</Box>
            ))}
            <Box
              component="a"
              href="https://github.com/marink/machinelearning"
              target="_blank"
              rel="noreferrer"
              sx={{ ...NAV_LINK, display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <GitHubIcon sx={{ fontSize: 16 }} /> GitHub
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : MINI_WIDTH,
            overflowX: 'hidden',
            transition: 'width 0.2s',
            mt: '44px',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            bgcolor: '#FAFAFA',
          },
        }}
      >
        <List dense sx={{ pt: 2 }}>
          {sections.map(s => (
            <ListItemButton
              key={s.id}
              onClick={() => scrollTo(s.id)}
              sx={{
                py: 0.75, px: 2, borderRadius: 1, mx: 0.5,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: '#1565C0' }}>{s.icon}</ListItemIcon>
              {open && (
                <ListItemText
                  primary={s.label}
                  slotProps={{ primary: { sx: { fontSize: 13, fontWeight: 500, color: '#1d1d1f' } } }}
                />
              )}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${open ? DRAWER_WIDTH : MINI_WIDTH}px`,
          mt: '44px',
          transition: 'margin 0.2s',
          bgcolor: '#fff',
        }}
      >
        <Container maxWidth="md" sx={{ py: 7, px: { xs: 3, md: 6 } }}>

          {/* Page title */}
          <Typography sx={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em', color: '#1d1d1f', mb: 1 }}>
            Documentation
          </Typography>
          <Typography sx={{ fontSize: 21, color: 'rgba(0,0,0,0.5)', mb: 6, fontWeight: 400 }}>
            Algorithms, data formats, and evaluation methods.
          </Typography>

          <Section id="overview" title="Overview">
            <Para>
              MachineLearning.js.org implements a selection of classic supervised and unsupervised machine
              learning algorithms entirely in JavaScript — no server, no dependencies beyond what ships with
              the app. Every computation happens in your browser.
            </Para>
            <Para>
              The algorithms and evaluation methods follow the descriptions in{' '}
              <a href="https://ml.cms.waikato.ac.nz/weka/book.html" target="_blank" rel="noreferrer"
                style={{ color: '#1565C0' }}>
                Data Mining: Practical Machine Learning Tools and Techniques
              </a>{' '}
              by Witten, Frank, Hall &amp; Pal (University of Waikato). The ARFF file format is Weka&apos;s own invention.
            </Para>
            <Alert severity="info" sx={{ mt: 2, fontSize: 15 }}>
              Open the <strong>Explorer</strong> to load a dataset and try the algorithms interactively.
            </Alert>
          </Section>

          <Section id="knn" title="k-Nearest Neighbor">
            <Citation
              title="Nearest Neighbor Pattern Classification"
              authors="T.M. Cover & P.E. Hart"
              venue="IEEE Transactions on Information Theory, Vol. 13"
              year="1967"
              url="https://doi.org/10.1109/TIT.1967.1053964"
              note="IEEE Xplore — institutional access may be required"
            />
            <Para>
              k-NN is a lazy learner — it stores the training set and classifies a new instance by finding
              the k closest training examples and taking a majority vote of their class labels. There is no
              training phase; all computation happens at query time.
            </Para>
            <SubHead>Algorithm</SubHead>
            <Code>{`For a new instance x:
  1. Compute distance(x, xᵢ) for every training instance xᵢ
  2. Sort by distance, take the k smallest
  3. Return the most common class label among those k neighbours`}</Code>
            <SubHead>Distance metric</SubHead>
            <Para>
              Numeric attributes use normalized Euclidean distance. Nominal attributes use the overlap
              metric (0 if equal, 1 otherwise). Missing values contribute a worst-case penalty of 1.
            </Para>
            <SubHead>Theory → Code</SubHead>
            <Para>
              Cover &amp; Hart prove that the 1-NN error rate asymptotically cannot exceed twice the Bayes
              error rate. Four implementation steps map directly to the paper:
            </Para>
            <StepLabel n={1} label="Normalize so no attribute's scale dominates the distance" />
            <Code>{`// buildNorm() precomputes per-attribute min/max over the training set
const range = norm.maxs[i] - norm.mins[i] || 1;
sum += ((a[i] - b[i]) / range) ** 2;   // normalized Euclidean contribution`}</Code>
            <StepLabel n={2} label="Mixed-attribute distance — numeric, nominal, and missing values" />
            <Code>{`if (attributes[i].type === 'numeric') {
  sum += ((a[i] - b[i]) / range) ** 2;  // normalized Euclidean
} else {
  sum += a[i] === b[i] ? 0 : 1;         // overlap metric for nominal
}
// a[i] === null: sum += 1  (maximum possible distance contribution)`}</Code>
            <StepLabel n={3} label="Lazy model — the dataset IS the model (no training phase)" />
            <Code>{`export function train(ds) {
  // No learning happens here. train() captures the dataset and
  // precomputes normalization bounds — O(n·d) once, not per query.
  return { instances: ds.instances, attributes: ds.attributes,
           classIndex: ds.classIndex,
           norm: buildNorm(ds.instances, ds.attributes, ds.classIndex) };
}`}</Code>
            <StepLabel n={4} label="k-majority vote at classify time" />
            <Code>{`export function classify(model, instance, k = 1) {
  const dists = instances.map(tr => ({ d: dist(tr, instance, ...), c: tr[classIndex] }));
  dists.sort((a, b) => a.d - b.d);            // sort ascending by distance
  const votes = {};
  for (const { c } of dists.slice(0, k))     // tally top-k class labels
    votes[c] = (votes[c] || 0) + 1;
  return Object.entries(votes)
    .sort((a, b) => b[1] - a[1])[0][0];      // return plurality class
}`}</Code>
            <SubHead>Parameters</SubHead>
            <Box sx={{ mb: 2 }}>
              <Chip label="k" size="small" color="primary" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>
                Number of neighbours. Default is 3. Odd values avoid ties.
              </Typography>
            </Box>
            <SubHead>Evaluation</SubHead>
            <Para>
              Leave-one-out cross-validation or a percentage hold-out split. The Explorer reports
              accuracy, confusion matrix, and per-class precision/recall/F1.
            </Para>
          </Section>

          <Section id="naivebayes" title="Naïve Bayes">
            <Citation
              title="Estimating Continuous Distributions in Bayesian Classifiers"
              authors="G.H. John & P. Langley"
              venue="UAI-95 — 11th Conference on Uncertainty in Artificial Intelligence"
              year="1995"
              url="https://arxiv.org/abs/1302.4964"
              note="Free PDF on arXiv"
            />
            <Para>
              Naïve Bayes applies Bayes&apos; theorem with the assumption that all attributes are
              conditionally independent given the class. Despite this rarely being true, it often performs
              surprisingly well — especially on text and high-dimensional data.
            </Para>
            <SubHead>Algorithm</SubHead>
            <Code>{`P(class | x) ∝ P(class) × ∏ P(xᵢ | class)

Numeric attributes: Gaussian distribution (John & Langley §3)
  P(xᵢ | class) = (1/√(2πσ²)) × exp(−(x − μ)² / 2σ²)

Nominal attributes: Laplace-smoothed frequency counts
  P(xᵢ = v | class) = (count(v in class) + 1) / (count(class) + |values|)`}</Code>
            <SubHead>Theory → Code</SubHead>
            <Para>
              John &amp; Langley extend classic Naïve Bayes to handle continuous attributes with Gaussian
              density estimation — the core contribution of their 1995 paper. Four steps map to the code:
            </Para>
            <StepLabel n={1} label="Compute class priors P(class) from training frequencies" />
            <Code>{`for (const cv of classValues) {
  const subset = instances.filter(i => i[classIndex] === cv);
  priors[cv] = subset.length / instances.length;  // MLE prior
}`}</Code>
            <StepLabel n={2} label="Gaussian likelihood for numeric attributes (John & Langley §3)" />
            <Code>{`// Estimate μ and σ² per (class, attribute) pair
const mean = vals.reduce((s, v) => s + v, 0) / (vals.length || 1);
const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0)
                   / (vals.length || 1) || 1e-9;  // floor prevents div-by-zero
likelihoods[cv][i] = { mean, variance };

// At classify time — log-form avoids floating-point underflow:
function gaussianLog(x, mean, variance) {
  return -0.5 * Math.log(2 * Math.PI * variance) - ((x - mean) ** 2) / (2 * variance);
}`}</Code>
            <StepLabel n={3} label="Laplace-smoothed counts for nominal attributes" />
            <Code>{`// Seed every nominal value with count=1 before observing any data.
// This prevents P(unseen value | class) = 0 from wiping out the posterior.
const counts = {};
for (const v of attrVals) counts[v] = 1;            // Laplace prior
for (const v of vals)     counts[v] = (counts[v] || 1) + 1;
likelihoods[cv][i] = { counts, total: vals.length + attrVals.length };

// At classify time:
logP += Math.log((lk.counts[instance[i]] || 1) / lk.total);`}</Code>
            <StepLabel n={4} label="Classify in log-probability space — prevents underflow" />
            <Code>{`let logP = Math.log(priors[cv]);           // log P(class)
for (let i = 0; i < attributes.length; i++) {
  if (attributes[i].type === 'numeric')
    logP += gaussianLog(instance[i], lk.mean, lk.variance);
  else
    logP += Math.log((lk.counts[instance[i]] || 1) / lk.total);
}
if (logP > bestScore) { bestScore = logP; best = cv; }  // argmax`}</Code>
            <SubHead>Notes</SubHead>
            <Para>
              Laplace smoothing prevents zero-probability issues for nominal values not seen during
              training. The variance floor (<code style={{ fontFamily: 'monospace', fontSize: 13 }}>1e-9</code>)
              prevents division by zero when all training instances in a class share the same numeric value.
            </Para>
          </Section>

          <Section id="kmeans" title="k-Means Clustering">
            <Citation
              title="Some Methods for Classification and Analysis of Multivariate Observations"
              authors="J.B. MacQueen"
              venue="Proc. 5th Berkeley Symposium on Mathematical Statistics and Probability"
              year="1967"
              url="https://projecteuclid.org/euclid.bsmsp/1200512992"
              note="Free — Project Euclid"
            />
            <Para>
              k-Means partitions instances into k clusters by iteratively assigning each instance to the
              nearest centroid (Euclidean distance on numeric attributes) and recomputing centroids until
              convergence.
            </Para>
            <SubHead>Algorithm</SubHead>
            <Code>{`1. Initialise k centroids (random instances from the dataset)
2. Repeat until no assignment changes (or maxIter reached):
   a. Assign each instance to the nearest centroid
      (Euclidean distance on numeric attributes)
   b. Recompute each centroid as the mean of its assigned instances
3. Report assignments, centroid values, sizes, and WCSS`}</Code>
            <SubHead>Theory → Code</SubHead>
            <Para>
              MacQueen&apos;s original formulation is the classic Lloyd&apos;s algorithm. Five stages map
              directly to the implementation:
            </Para>
            <StepLabel n={1} label="Initialization — random instances as starting centroids" />
            <Code>{`// Shuffle the dataset and take the first k instances as seeds.
// Simple, avoids duplicates, sufficient for small-to-medium datasets.
const shuffled = [...instances].sort(() => Math.random() - 0.5);
let centroids = shuffled.slice(0, k).map(inst => idxs.map(i => inst[i] ?? 0));`}</Code>
            <StepLabel n={2} label="Assignment step — argmin distance to centroid" />
            <Code>{`const newAssign = projected.map(p => {
  let best = 0, bestD = Infinity;
  for (let ki = 0; ki < k; ki++) {
    const d = centroidDist(p, centroids[ki], idxs.map((_, j) => j));
    if (d < bestD) { bestD = d; best = ki; }   // argmin over centroids
  }
  return best;
});`}</Code>
            <StepLabel n={3} label="Update step — recompute centroids as cluster means" />
            <Code>{`function updateCentroids(instances, assignments, k, idxs) {
  return Array.from({ length: k }, (_, ki) => {
    const members = instances.filter((_, j) => assignments[j] === ki);
    // Empty cluster: reassign to a random instance (avoids degenerate solution)
    if (!members.length) return instances[Math.floor(Math.random() * instances.length)];
    return idxs.map(i => members.reduce((s, m) => s + (m[i] ?? 0), 0) / members.length);
  });
}`}</Code>
            <StepLabel n={4} label="Convergence check — stop when no assignments change" />
            <Code>{`const changed = newAssign.some((a, i) => a !== assignments[i]);
assignments = newAssign;
if (!changed) break;   // Lloyd's algorithm is guaranteed to converge`}</Code>
            <StepLabel n={5} label="WCSS — within-cluster sum of squares (objective function)" />
            <Code>{`// WCSS = Σᵢ Σⱼ∈cluster(i) ||xⱼ − centroidᵢ||²
// Lower WCSS → tighter clusters. Always decreases as k increases,
// so only compare models with the same k value (elbow method).
const wcss = projected.reduce((s, p, j) =>
  s + idxs.reduce((s2, _, ii) =>
    s2 + (p[ii] - centroids[assignments[j]][ii]) ** 2, 0), 0);`}</Code>
            <SubHead>Parameters</SubHead>
            <Box sx={{ mb: 1 }}>
              <Chip label="k" size="small" color="primary" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>
                Number of clusters.
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip label="Max iterations" size="small" color="primary" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>
                Safety limit (default 100). The algorithm typically converges much sooner.
              </Typography>
            </Box>
            <SubHead>Output</SubHead>
            <Para>
              Cluster assignments, centroid values per attribute, cluster sizes, and the within-cluster
              sum of squares (lower is better — but always decreases as k grows, so compare models with
              the same k).
            </Para>
          </Section>

          <Section id="arff" title="ARFF File Format">
            <Para>
              The Attribute-Relation File Format (ARFF) is an ASCII text file that describes a list of
              instances sharing a set of attributes. ARFF files were developed by the Machine Learning
              Project at the Department of Computer Science of the University of Waikato for use with the
              Weka machine learning software.
            </Para>
            <Para>
              An ARFF file has two distinct sections: the <strong>Header</strong> (relation name and
              attribute declarations) followed by the <strong>Data</strong> section.
            </Para>
            <SubHead>Structure</SubHead>
            <Code>{`% 1. Title: Iris Plants Database
% Creator: R.A. Fisher

@relation iris

@attribute sepallength  numeric
@attribute sepalwidth   numeric
@attribute petallength  numeric
@attribute petalwidth   numeric
@attribute class        {Iris-setosa,Iris-versicolor,Iris-virginica}

@data
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
4.7,3.2,1.3,0.2,Iris-setosa
...`}</Code>
            <SubHead>Attribute types</SubHead>
            <Box sx={{ mb: 1 }}>
              <Chip label="numeric" size="small" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>Continuous real-valued attributes.</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label="{v1,v2,...}" size="small" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>Nominal (categorical) — lists all possible values. Used for the class attribute.</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label="string" size="small" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>Free-form string values. Treated as nominal in this tool.</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip label="date" size="small" sx={{ mr: 1 }} />
              <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)' }}>Date/time values. Parsed as numeric timestamps.</Typography>
            </Box>
            <Para>
              Lines beginning with <code style={{ fontFamily: 'monospace', fontSize: 14 }}>%</code> are
              comments and are ignored. Missing values are represented by{' '}
              <code style={{ fontFamily: 'monospace', fontSize: 14 }}>?</code>. For the full specification
              see{' '}
              <a href="https://www.cs.waikato.ac.nz/ml/weka/arff.html" target="_blank" rel="noreferrer"
                style={{ color: '#1565C0' }}>waikato.ac.nz/ml/weka/arff.html</a>.
            </Para>
            <Alert severity="info" sx={{ fontSize: 15 }}>
              Sample datasets (<code>iris.arff</code>, <code>weather.arff</code>) are available in the
              Explorer via the <strong>Sample</strong> button.
            </Alert>
          </Section>

          <Section id="csv" title="CSV Format">
            <Para>
              Plain CSV files are also supported. The first row must be a header with attribute names.
              The last column is assumed to be the class attribute.
            </Para>
            <SubHead>Example</SubHead>
            <Code>{`sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
...`}</Code>
            <Para>
              Columns with non-numeric values are treated as nominal. Missing values (empty cells) are
              counted during preprocessing and skipped during distance and probability calculations.
            </Para>
          </Section>

          <Section id="datasets" title="Sample Datasets">
            <Para>
              The following classic datasets from the{' '}
              <a href="https://archive.ics.uci.edu/" target="_blank" rel="noreferrer" style={{ color: '#1565C0' }}>
                UCI Machine Learning Repository
              </a>{' '}
              are available in ARFF format and work directly with the Explorer. They are widely used as
              benchmarks in machine learning research and are referenced throughout the Witten &amp; Frank book.
              ARFF files are hosted by{' '}
              <a href="https://storm.cis.fordham.edu/~gweiss/data-mining/datasets.html" target="_blank" rel="noreferrer" style={{ color: '#1565C0' }}>
                Fordham University
              </a>.
            </Para>

            {[
              {
                name: 'Iris',
                instances: 150, attrs: 4, task: 'Classification',
                desc: 'The most famous dataset in machine learning. Measurements of sepal and petal length and width for three iris species (setosa, versicolor, virginica), 50 instances each. Introduced by R.A. Fisher in 1936.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/iris.arff',
                uci: 'https://archive.ics.uci.edu/dataset/53/iris',
              },
              {
                name: 'Weather (Nominal)',
                instances: 14, attrs: 4, task: 'Classification',
                desc: 'The canonical toy dataset from the Weka book. Predicts whether conditions are suitable to play golf based on outlook, temperature, humidity, and wind. All attributes are nominal. Used throughout the book to illustrate decision trees and Naïve Bayes.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/weather.nominal.arff',
                uci: null,
              },
              {
                name: 'Contact Lenses',
                instances: 24, attrs: 4, task: 'Classification',
                desc: 'All possible combinations of four nominal attributes (age, spectacle prescription, astigmatism, tear production rate) for recommending soft, hard, or no contact lenses. Small but complete — no missing values.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/contact-lenses.arff',
                uci: 'https://archive.ics.uci.edu/dataset/58/lenses',
              },
              {
                name: 'Labor Relations',
                instances: 57, attrs: 16, task: 'Classification',
                desc: 'Final settlements from Canadian labor negotiations (1987–1988) in the business and personal services sector. Mixed numeric and nominal attributes covering wages, hours, pension, and leave. Classifies contracts as acceptable or not.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/labor.arff',
                uci: 'https://archive.ics.uci.edu/dataset/57/labor+relations',
              },
              {
                name: 'Adult (Census Income)',
                instances: 48842, attrs: 14, task: 'Classification',
                desc: 'Extracted from the 1994 U.S. Census Bureau database. Predicts whether a person\'s annual income exceeds $50,000 based on demographic attributes including age, education, occupation, marital status, race, and hours worked per week. One of the most widely used benchmark datasets for bias and fairness research.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/adult.arff',
                uci: 'https://archive.ics.uci.edu/dataset/2/adult',
              },
              {
                name: 'Congressional Voting Records',
                instances: 435, attrs: 16, task: 'Classification',
                desc: '1984 U.S. House of Representatives voting records on 16 key issues (e.g. aid to Nicaragua, anti-satellite test ban, physician fee freeze). Each instance is a member of Congress classified as Democrat or Republican.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/vote.arff',
                uci: 'https://archive.ics.uci.edu/dataset/105/congressional+voting+records',
              },
              {
                name: 'Pima Indians Diabetes',
                instances: 768, attrs: 8, task: 'Classification',
                desc: 'Medical records from the National Institute of Diabetes for Pima Indian women aged 21 or older near Phoenix, Arizona. Attributes include glucose concentration, blood pressure, BMI, insulin level, and diabetes pedigree function. Predicts onset of diabetes.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/diabetes.arff',
                uci: 'https://archive.ics.uci.edu/dataset/34/diabetes',
              },
              {
                name: 'German Credit (credit-g)',
                instances: 1000, attrs: 20, task: 'Classification',
                desc: 'Credit risk classification for applicants at a German bank. Mixed attributes cover credit history, loan purpose, employment status, savings, and personal information. Classifies applicants as good or bad credit risks. A cost matrix applies — misclassifying a bad risk as good is five times more costly.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/credit-g.arff',
                uci: 'https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data',
              },
              {
                name: 'Glass Identification',
                instances: 214, attrs: 9, task: 'Classification',
                desc: 'Chemical composition measurements (refractive index plus oxide content of Na, Mg, Al, Si, K, Ca, Ba, Fe) for 214 glass samples from crime scene investigations. Six glass types including float and non-float window glass, containers, tableware, and headlamps.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/glass.arff',
                uci: 'https://archive.ics.uci.edu/dataset/42/glass+identification',
              },
              {
                name: 'Ionosphere',
                instances: 351, attrs: 34, task: 'Classification',
                desc: 'Radar returns from a phased array of 16 HF antennas in Goose Bay, Labrador, targeting free electrons in the ionosphere. Returns classified as "good" (evidence of structure) or "bad" (pass-throughs). All 34 attributes are continuous pulse numbers.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/ionosphere.arff',
                uci: 'https://archive.ics.uci.edu/dataset/52/ionosphere',
              },
              {
                name: 'Image Segmentation',
                instances: 210, attrs: 19, task: 'Classification',
                desc: 'Each instance is a 3×3-pixel region drawn from seven outdoor images. Nineteen continuous attributes describe the region\'s spectral and geometric properties. Seven classes: brickface, sky, foliage, cement, window, path, and grass.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/segment-challenge.arff',
                uci: 'https://archive.ics.uci.edu/dataset/50/image+segmentation',
              },
              {
                name: 'Hypothyroid',
                instances: 3772, attrs: 30, task: 'Classification',
                desc: 'Patient records from the Garavan Institute for diagnosing thyroid disorders. Seven continuous attributes (TSH, T3, TT4, T4U, FTI, age) and 23 nominal attributes including medications and test flags. Four classes: negative, compensated hypothyroid, primary hypothyroid, secondary hypothyroid. Contains missing values.',
                arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/hypothyroid.arff',
                uci: 'https://archive.ics.uci.edu/dataset/102/thyroid+disease',
              },
            ].map(ds => (
              <Box key={ds.name} sx={{ mb: 2.5, p: 2.5, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, bgcolor: '#FAFAFA' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#1d1d1f', mr: 0.5 }}>{ds.name}</Typography>
                  <Chip label={`${ds.instances.toLocaleString()} instances`} size="small" variant="outlined" />
                  <Chip label={`${ds.attrs} attributes`} size="small" variant="outlined" />
                  <Chip label={ds.task} size="small" color="primary" />
                </Box>
                <Typography sx={{ fontSize: 15, color: 'rgba(0,0,0,0.65)', mb: 1.5, lineHeight: 1.65 }}>
                  {ds.desc}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <a href={ds.arff} target="_blank" rel="noreferrer"
                    style={{ color: '#1565C0', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                    ↓ Download ARFF
                  </a>
                  {ds.uci && (
                    <a href={ds.uci} target="_blank" rel="noreferrer"
                      style={{ color: '#1565C0', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
                      UCI Repository →
                    </a>
                  )}
                </Box>
              </Box>
            ))}
          </Section>

        </Container>
      </Box>

      <Box sx={{
        py: 4,
        textAlign: 'center',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        bgcolor: '#F5F5F7',
        ml: `${open ? DRAWER_WIDTH : MINI_WIDTH}px`,
        transition: 'margin 0.2s',
      }}>
        <Typography sx={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
          machinelearning.js.org · open source · MIT
        </Typography>
      </Box>
    </Box>
  );
}
