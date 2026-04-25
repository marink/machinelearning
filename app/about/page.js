"use client";

import {
  Box, AppBar, Toolbar, Typography, Button, Container,
  Divider, Stack, Chip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import ScienceIcon from '@mui/icons-material/Science';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const NAV_LINK = {
  fontSize: 13,
  fontWeight: 500,
  color: 'rgba(44,44,44,0.8)',
  textDecoration: 'none',
  mx: 1.5,
  '&:hover': { color: '#000' },
};

export default function AboutPage() {
  const [bookExpanded, setBookExpanded] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>

      {/* Apple-style frosted glass AppBar */}
      <AppBar position="sticky" elevation={0} sx={{
        bgcolor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        color: 'rgba(0,0,0,0.8)',
        backgroundImage: 'none',
      }}>
        <Toolbar variant="dense" sx={{ maxWidth: 980, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 }, minHeight: '44px !important' }}>
          <Box component={Link} href="/" sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            textDecoration: 'none', flexGrow: 1,
          }}>
            <ScienceIcon sx={{ fontSize: 17, color: '#1565C0' }} />
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
              MachineLearning.js
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {[
              { label: 'Home',     href: '/' },
              { label: 'Explorer', href: '/explorer/' },
              { label: 'Docs',     href: '/docs/' },
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
              <GitHubIcon sx={{ fontSize: 15 }} /> GitHub
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>

        <Typography sx={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em', color: '#1d1d1f', mb: 1 }}>
          About
        </Typography>
        <Typography sx={{ fontSize: 21, color: 'rgba(0,0,0,0.5)', mb: 6, fontWeight: 400, maxWidth: 620 }}>
          This site is intended to serve as a common resource for Machine Learning algorithms
          implemented in JavaScript and run in a Web browser.
        </Typography>

        <Divider sx={{ mb: 6, borderColor: 'rgba(0,0,0,0.1)' }} />

        {/* Book section */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={5} alignItems="flex-start" sx={{ mb: 7 }}>
          <Box sx={{ flexShrink: 0 }}>
            <a href="https://www.cs.waikato.ac.nz/ml/weka/book.html" target="_blank" rel="noreferrer">
              <Image
                src="/images/weka-book-cover-4e.jpg"
                alt="Data Mining: Practical Machine Learning Tools and Techniques — 4th Edition"
                width={130}
                height={173}
                style={{ display: 'block', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
              />
            </a>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: '#1d1d1f', mb: 0.5 }}>
              Data Mining: Practical Machine Learning Tools and Techniques
            </Typography>
            <Typography sx={{ fontSize: 15, color: 'rgba(0,0,0,0.45)', mb: 2 }}>
              Witten, Frank, Hall &amp; Pal · 4th Edition · University of Waikato
            </Typography>
            <Typography sx={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', mb: 2 }}>
              Most algorithms implemented here follow the descriptions in this book.
              As a result, data analysis tools are available which generate useful statistics
              about datasets loaded into the browser — including attribute distributions,
              missing value counts, and evaluation metrics.
            </Typography>

            {/* Expandable feature list */}
            {bookExpanded && (
              <Stack spacing={0.75} sx={{ mb: 2 }}>
                {[
                  'Explains how machine learning algorithms for data mining work.',
                  'Helps compare and evaluate results from different techniques.',
                  'Covers performance improvement including input preprocessing and combining outputs.',
                  'Features in-depth information on probabilistic models and deep learning.',
                  'Provides an introduction to the Weka workbench with links to algorithm implementations.',
                ].map(f => (
                  <Typography key={f} sx={{ fontSize: 15, color: 'rgba(0,0,0,0.6)', pl: 1.5,
                    '&::before': { content: '"·"', mr: 1, color: '#1565C0', fontWeight: 700 } }}>
                    {f}
                  </Typography>
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                href="https://www.cs.waikato.ac.nz/ml/weka/book.html"
                target="_blank"
                sx={{ fontSize: 13, color: '#1565C0', borderColor: '#1565C0', textTransform: 'none' }}
              >
                Book web site
              </Button>
              <Button
                size="small"
                endIcon={<ExpandMoreIcon sx={{ transform: bookExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />}
                onClick={() => setBookExpanded(v => !v)}
                sx={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', textTransform: 'none' }}
              >
                {bookExpanded ? 'Less' : 'Features'}
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ mb: 6, borderColor: 'rgba(0,0,0,0.1)' }} />

        {/* What it does */}
        <Typography sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#1d1d1f', mb: 3 }}>
          What it does
        </Typography>
        <Typography sx={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', mb: 4 }}>
          Load any ARFF or CSV dataset and the Explorer gives you four tabs:
        </Typography>
        <Stack spacing={3} sx={{ mb: 7 }}>
          {[
            { label: 'Preprocess', desc: 'Inspect attribute types, statistics, class distribution, and missing value counts.' },
            { label: 'Classify',   desc: 'Train k-NN or Naïve Bayes. Evaluate using cross-validation or a percentage hold-out split. See accuracy, confusion matrix, and per-class precision/recall.' },
            { label: 'Cluster',    desc: 'Run k-Means with configurable k. Visualize cluster centroids and within-cluster sum of squares.' },
            { label: 'Visualize',  desc: 'Plot any two numeric attributes against each other. Points are coloured by class label.' },
          ].map(({ label, desc }) => (
            <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Chip label={label} size="small" color="primary" sx={{ mt: 0.4, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(0,0,0,0.7)' }}>{desc}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ mb: 6, borderColor: 'rgba(0,0,0,0.1)' }} />

        {/* Tech stack */}
        <Typography sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#1d1d1f', mb: 3 }}>
          Tech stack
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 7 }}>
          {['Next.js 16', 'Material UI v6', 'Recharts', 'App Router', 'Static Export'].map(t => (
            <Chip key={t} label={t} variant="outlined" size="small"
              sx={{ fontSize: 13, borderColor: 'rgba(0,0,0,0.2)', color: 'rgba(0,0,0,0.6)' }} />
          ))}
        </Stack>

        <Divider sx={{ mb: 6, borderColor: 'rgba(0,0,0,0.1)' }} />

        {/* Open source */}
        <Typography sx={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#1d1d1f', mb: 2 }}>
          Open source
        </Typography>
        <Typography sx={{ fontSize: 17, color: 'rgba(0,0,0,0.6)', mb: 3 }}>
          MIT licensed. Contributions welcome.
        </Typography>
        <Button
          variant="contained"
          href="https://github.com/marink/machinelearning"
          target="_blank"
          startIcon={<GitHubIcon />}
          sx={{ bgcolor: '#1d1d1f', '&:hover': { bgcolor: '#333' }, textTransform: 'none', fontSize: 14 }}
        >
          View on GitHub
        </Button>
      </Container>

      <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.1)', bgcolor: '#F5F5F7' }}>
        <Typography sx={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
          machinelearning.js.org · open source · MIT
        </Typography>
      </Box>
    </Box>
  );
}
