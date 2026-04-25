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
                  primaryTypographyProps={{ fontSize: 13, fontWeight: 500, color: '#1d1d1f' }}
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
              <a href="https://www.cs.waikato.ac.nz/~ml/book" target="_blank" rel="noreferrer"
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
            <Para>
              k-NN is a lazy learner — it stores the training set and classifies a new instance by finding
              the k closest training examples (by Euclidean distance over numeric attributes) and taking a
              majority vote of their class labels.
            </Para>
            <SubHead>Algorithm</SubHead>
            <Code>{`For a new instance x:
  1. Compute distance(x, xᵢ) for every training instance xᵢ
  2. Sort by distance, take the k smallest
  3. Return the most common class label among those k neighbours`}</Code>
            <SubHead>Distance</SubHead>
            <Para>
              Euclidean distance on normalised numeric attributes. Nominal attributes use a 0/1 overlap
              metric (0 if equal, 1 if not).
            </Para>
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
            <Para>
              Naïve Bayes applies Bayes&apos; theorem with the strong (naïve) assumption that all attributes
              are conditionally independent given the class. Despite this rarely being true in practice,
              it often performs surprisingly well.
            </Para>
            <SubHead>Algorithm</SubHead>
            <Code>{`P(class | x) ∝ P(class) × ∏ P(xᵢ | class)

Numeric attributes: modelled as Gaussian distributions
  P(xᵢ | class) = Normal(μ_class, σ_class)

Nominal attributes: frequency counts with Laplace smoothing
  P(xᵢ = v | class) = (count(v in class) + 1) / (count(class) + |values|)`}</Code>
            <SubHead>Notes</SubHead>
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
            <SubHead>Algorithm</SubHead>
            <Code>{`1. Initialise k centroids (random instances from the dataset)
2. Repeat until centroids stop moving:
   a. Assign each instance to the nearest centroid
      (Euclidean distance on numeric attributes)
   b. Recompute each centroid as the mean of its assigned instances
3. Report cluster assignments and within-cluster sum of squares (WCSS)`}</Code>
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
