"use client";

import {
  Box, AppBar, Toolbar, Typography, Button, Container,
  Divider, Stack, Chip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ScienceIcon from '@mui/icons-material/Science';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ScienceIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: '-0.5px' }}>
            machinelearning.js.org
          </Typography>
          <Button color="inherit" component={Link} href="/">Home</Button>
          <Button color="inherit" component={Link} href="/explorer/">Explorer</Button>
          <Button color="inherit" component={Link} href="/docs/">Docs</Button>
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

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          About this project
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 680 }}>
          <strong>machinelearning.js.org</strong> is a JavaScript reimagining of{' '}
          <a href="https://ml.cms.waikato.ac.nz/weka/" target="_blank" rel="noreferrer"
            style={{ color: '#00796B' }}>Weka</a>{' '}
          — the classic machine learning workbench from the University of Waikato. It runs entirely in
          your browser: no server, no installs, no data ever leaves your machine.
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Inspired by
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="flex-start" sx={{ mb: 6 }}>
          <Box sx={{ flexShrink: 0 }}>
            <a href="https://www.cs.waikato.ac.nz/~ml/book" target="_blank" rel="noreferrer">
              <Image
                src="https://www.cs.waikato.ac.nz/~ml/images/Book4thEd.jpg"
                alt="Data Mining: Practical Machine Learning Tools and Techniques — 4th Edition"
                width={120}
                height={160}
                style={{ display: 'block', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                unoptimized
              />
            </a>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Data Mining: Practical Machine Learning Tools and Techniques
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Witten, Frank, Hall &amp; Pal · 4th Edition · University of Waikato
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The algorithms implemented here follow the descriptions in this book — from the k-NN
              classifier to k-Means clustering and Naïve Bayes. The ARFF file format used for
              datasets is also Weka&apos;s invention.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              href="https://www.cs.waikato.ac.nz/~ml/book"
              target="_blank"
              sx={{ mt: 2, color: '#00796B', borderColor: '#00796B' }}
            >
              Learn more
            </Button>
          </Box>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          What it does
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Load any ARFF or CSV dataset and the Explorer gives you four tabs:
        </Typography>
        <Stack spacing={2} sx={{ mb: 6 }}>
          {[
            { label: 'Preprocess', desc: 'Inspect attribute types, statistics, class distribution, and missing value counts.' },
            { label: 'Classify', desc: 'Train k-NN or Naïve Bayes. Evaluate using cross-validation or a percentage hold-out split. See accuracy, confusion matrix, and per-class precision/recall.' },
            { label: 'Cluster', desc: 'Run k-Means with configurable k. Visualize cluster centroids and within-cluster sum of squares.' },
            { label: 'Visualize', desc: 'Plot any two numeric attributes against each other. Points are coloured by class label.' },
          ].map(({ label, desc }) => (
            <Box key={label}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                <Chip label={label} size="small" color="primary" />
              </Stack>
              <Typography variant="body2" color="text.secondary">{desc}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Tech stack
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 6 }}>
          {['Next.js 16', 'Material UI v6', 'Recharts', 'App Router', 'Static Export'].map(t => (
            <Chip key={t} label={t} variant="outlined" size="small" />
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Open source
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          MIT licensed. Contributions welcome.
        </Typography>
        <Button
          variant="contained"
          href="https://github.com/marink/machinelearning"
          target="_blank"
          startIcon={<GitHubIcon />}
          sx={{ bgcolor: '#00796B', '&:hover': { bgcolor: '#00695C' } }}
        >
          View on GitHub
        </Button>
      </Container>

      <Box sx={{ py: 3, textAlign: 'center', bgcolor: '#004D40', color: 'rgba(255,255,255,0.6)' }}>
        <Typography variant="caption">
          machinelearning.js.org · open source · MIT
        </Typography>
      </Box>
    </Box>
  );
}
