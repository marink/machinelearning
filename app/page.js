"use client";

import {
  Box, AppBar, Toolbar, Typography, Button, Container,
  Grid, Card, CardContent, CardActionArea, Chip, Stack,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import GitHubIcon from '@mui/icons-material/GitHub';
import Link from 'next/link';

const features = [
  {
    icon: <ScienceIcon sx={{ fontSize: 40, color: '#00897B' }} />,
    title: 'Preprocess',
    desc: 'Upload CSV or ARFF datasets. Inspect attribute statistics, distributions, and missing values instantly.',
    href: '/explorer/',
  },
  {
    icon: <AccountTreeIcon sx={{ fontSize: 40, color: '#00897B' }} />,
    title: 'Classify',
    desc: 'Run k-NN and Naïve Bayes classifiers. Evaluate with cross-validation or a percentage hold-out split.',
    href: '/explorer/',
  },
  {
    icon: <BubbleChartIcon sx={{ fontSize: 40, color: '#00897B' }} />,
    title: 'Cluster',
    desc: 'Discover structure with k-Means. Visualize cluster assignments and within-cluster variance.',
    href: '/explorer/',
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: '#00897B' }} />,
    title: 'Visualize',
    desc: 'Explore your data with interactive 2-D scatter plots — select any two attributes and colour by class.',
    href: '/explorer/',
  },
];

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '-0.5px' }}>
            machinelearning.js.org
          </Typography>
          <Button color="inherit" component={Link} href="/explorer/">Explorer</Button>
          <Button color="inherit" component={Link} href="/docs/">Docs</Button>
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

      {/* Hero */}
      <Box sx={{ bgcolor: '#004D40', color: '#fff', py: 10, px: 2, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Machine Learning in your Browser
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.85, maxWidth: 600, mx: 'auto', mb: 4 }}>
          A JavaScript reimagining of Weka — load a dataset, train a model, and read the results.
          Nothing to install. Everything runs locally.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/explorer/"
            sx={{ bgcolor: '#00897B', '&:hover': { bgcolor: '#00695C' } }}
          >
            Open Explorer
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="https://www.cs.waikato.ac.nz/~ml/book"
            target="_blank"
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Witten &amp; Frank Book
          </Button>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 4 }} flexWrap="wrap">
          {['k-NN','Naïve Bayes','k-Means','ARFF','CSV','Zero Install'].map(t => (
            <Chip key={t} label={t} size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} />
          ))}
        </Stack>
      </Box>

      {/* Feature cards */}
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {features.map(f => (
            <Grid item xs={12} sm={6} md={3} key={f.title}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
                <CardActionArea component={Link} href={f.href} sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box mb={1}>{f.icon}</Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Inspired by */}
        <Box sx={{ mt: 8, textAlign: 'center', opacity: 0.7 }}>
          <Typography variant="body2">
            Inspired by{' '}
            <a href="https://ml.cms.waikato.ac.nz/weka/" target="_blank" rel="noreferrer"
               style={{ color: '#00796B' }}>
              Weka 3
            </a>{' '}
            from the University of Waikato and the book{' '}
            <em>Data Mining: Practical Machine Learning Tools and Techniques</em>.
          </Typography>
        </Box>
      </Container>

      <Box sx={{ py: 3, textAlign: 'center', bgcolor: '#004D40', color: 'rgba(255,255,255,0.6)' }}>
        <Typography variant="caption">
          machinelearning.js.org · open source · MIT
        </Typography>
      </Box>
    </Box>
  );
}
