"use client";

import { useState } from 'react';
import {
  Box, AppBar, Toolbar, Typography, Button,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, IconButton, Container, Chip, Paper, Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import InfoIcon from '@mui/icons-material/Info';
import TableChartIcon from '@mui/icons-material/TableChart';
import Link from 'next/link';

const DRAWER_WIDTH = 220;
const MINI_WIDTH = 56;

const sections = [
  { id: 'overview',    label: 'Overview',       icon: <InfoIcon /> },
  { id: 'knn',         label: 'k-NN',           icon: <AccountTreeIcon /> },
  { id: 'naivebayes',  label: 'Naïve Bayes',    icon: <ScienceIcon /> },
  { id: 'kmeans',      label: 'k-Means',        icon: <BubbleChartIcon /> },
  { id: 'arff',        label: 'ARFF Format',    icon: <InsertDriveFileIcon /> },
  { id: 'csv',         label: 'CSV Format',     icon: <TableChartIcon /> },
];

function Code({ children }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, my: 2, fontFamily: 'monospace', fontSize: 13, bgcolor: '#F5F5F5', whiteSpace: 'pre', overflowX: 'auto' }}>
      {children}
    </Paper>
  );
}

function Section({ id, title, children }) {
  return (
    <Box id={id} sx={{ mb: 6 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>{title}</Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  );
}

function Para({ children }) {
  return <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>{children}</Typography>;
}

export default function DocsPage() {
  const [open, setOpen] = useState(true);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(o => !o)} edge="start" sx={{ mr: 1 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <ScienceIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '-0.5px' }}>
            machinelearning.js.org
          </Typography>
          <Button color="inherit" component={Link} href="/" startIcon={<HomeIcon />}>Home</Button>
          <Button color="inherit" component={Link} href="/explorer/">Explorer</Button>
          <Button color="inherit" component={Link} href="/about/">About</Button>
          <Button
            color="inherit"
            href="https://github.com/marink/machinelearning"
            target="_blank"
            startIcon={<GitHubIcon />}
          >
            GitHub
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : MINI_WIDTH,
            overflowX: 'hidden',
            transition: 'width 0.2s',
            mt: '64px',
            borderRight: '1px solid rgba(0,0,0,0.08)',
          },
        }}
      >
        <List dense>
          {sections.map(s => (
            <ListItemButton key={s.id} onClick={() => scrollTo(s.id)} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>{s.icon}</ListItemIcon>
              {open && <ListItemText primary={s.label} primaryTypographyProps={{ fontSize: 14 }} />}
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${open ? DRAWER_WIDTH : MINI_WIDTH}px`,
          mt: '64px',
          transition: 'margin 0.2s',
          bgcolor: '#FAFAFA',
        }}
      >
        <Container maxWidth="md" sx={{ py: 6 }}>

          <Section id="overview" title="Overview">
            <Para>
              machinelearning.js.org implements a selection of classic supervised and unsupervised machine
              learning algorithms entirely in JavaScript — no server, no dependencies beyond what ships with
              the app. Every computation happens in your browser.
            </Para>
            <Para>
              The algorithms and evaluation methods follow the descriptions in{' '}
              <a href="https://www.cs.waikato.ac.nz/~ml/book" target="_blank" rel="noreferrer"
                style={{ color: '#00796B' }}>
                Data Mining: Practical Machine Learning Tools and Techniques
              </a>{' '}
              by Witten, Frank, Hall &amp; Pal (University of Waikato). The ARFF file format is Weka&apos;s own invention.
            </Para>
            <Alert severity="info" sx={{ mt: 2 }}>
              Open the <strong>Explorer</strong> to load a dataset and try the algorithms interactively.
            </Alert>
          </Section>

          <Section id="knn" title="k-Nearest Neighbor (k-NN)">
            <Para>
              k-NN is a lazy learner — it stores the training set and classifies a new instance by finding
              the k closest training examples (by Euclidean distance over numeric attributes) and taking a
              majority vote of their class labels.
            </Para>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Algorithm</Typography>
            <Code>{`For a new instance x:
  1. Compute distance(x, xᵢ) for every training instance xᵢ
  2. Sort by distance, take the k smallest
  3. Return the most common class label among those k neighbours`}</Code>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Distance</Typography>
            <Para>
              Euclidean distance on normalised numeric attributes. Nominal attributes use a 0/1 overlap
              metric (0 if equal, 1 if not).
            </Para>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Parameters</Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label="k" size="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">
                Number of neighbours. Default is 3. Odd values avoid ties.
              </Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Evaluation</Typography>
            <Para>
              Leave-one-out cross-validation or a percentage hold-out split. The Explorer reports
              accuracy, confusion matrix, and per-class precision/recall/F1.
            </Para>
          </Section>

          <Section id="naivebayes" title="Naïve Bayes">
            <Para>
              Naïve Bayes applies Bayes&apos; theorem with the strong (naïve) assumption that all attributes
              are conditionally independent given the class. Despite this rarely being true in practice,
              it often performs surprisingly well.
            </Para>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Algorithm</Typography>
            <Code>{`P(class | x) ∝ P(class) × ∏ P(xᵢ | class)

Numeric attributes: modelled as Gaussian distributions
  P(xᵢ | class) = Normal(μ_class, σ_class)

Nominal attributes: frequency counts with Laplace smoothing
  P(xᵢ = v | class) = (count(v in class) + 1) / (count(class) + |values|)`}</Code>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Notes</Typography>
            <Para>
              Laplace smoothing prevents zero-probability issues for unseen attribute values. Prediction
              is computed in log-probability space to avoid underflow with many attributes.
            </Para>
          </Section>

          <Section id="kmeans" title="k-Means Clustering">
            <Para>
              k-Means partitions instances into k clusters by iteratively assigning each instance to the
              nearest centroid and recomputing centroids until convergence.
            </Para>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Algorithm</Typography>
            <Code>{`1. Initialise k centroids (random instances from the dataset)
2. Repeat until centroids stop moving:
   a. Assign each instance to the nearest centroid
      (Euclidean distance on numeric attributes)
   b. Recompute each centroid as the mean of its assigned instances
3. Report cluster assignments and within-cluster sum of squares (WCSS)`}</Code>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Parameters</Typography>
            <Box sx={{ mb: 1 }}>
              <Chip label="k" size="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">
                Number of clusters.
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip label="Max iterations" size="small" color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">
                Safety limit (default 100). In practice the algorithm converges much sooner.
              </Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Output</Typography>
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
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Structure</Typography>
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
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Attribute types</Typography>
            <Box sx={{ mb: 1 }}>
              <Chip label="numeric" size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">Continuous real-valued attributes.</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label="{v1,v2,...}" size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">Nominal (categorical) — lists all possible values. Used for the class attribute.</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Chip label="string" size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">Free-form string values. Treated as nominal in this tool.</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip label="date" size="small" sx={{ mr: 1 }} />
              <Typography variant="body2" component="span" color="text.secondary">Date/time values (ISO-8601 format). Parsed as numeric timestamps.</Typography>
            </Box>
            <Para>
              Lines beginning with <code>%</code> are comments and are ignored. Missing values are
              represented by <code>?</code> in the data section. Attribute names and string values
              containing spaces must be quoted.
            </Para>
            <Alert severity="info">
              Sample datasets (<code>iris.arff</code>, <code>weather.arff</code>) are available directly
              in the Explorer via the <strong>Sample</strong> button. For the full ARFF specification see{' '}
              <a href="https://www.cs.waikato.ac.nz/ml/weka/arff.html" target="_blank" rel="noreferrer"
                style={{ color: '#00796B' }}>waikato.ac.nz/ml/weka/arff.html</a>.
            </Alert>
          </Section>

          <Section id="csv" title="CSV Format">
            <Para>
              Plain CSV files are also supported. The first row must be a header with attribute names.
              The last column is assumed to be the class attribute.
            </Para>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Example</Typography>
            <Code>{`sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
...`}</Code>
            <Para>
              Columns with non-numeric values are treated as nominal. All numeric columns are treated as
              continuous. Missing values (empty cells) are counted during preprocessing and skipped during
              distance/probability calculations.
            </Para>
          </Section>

        </Container>
      </Box>

      <Box sx={{
        py: 3, textAlign: 'center', bgcolor: '#004D40', color: 'rgba(255,255,255,0.6)',
        ml: `${open ? DRAWER_WIDTH : MINI_WIDTH}px`, transition: 'margin 0.2s',
      }}>
        <Typography variant="caption">
          machinelearning.js.org · open source · MIT
        </Typography>
      </Box>
    </Box>
  );
}
