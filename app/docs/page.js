"use client";

import { Box, Typography, Chip, Alert } from '@mui/material';
import Link from 'next/link';
import DocPage from '@components/docs/DocPage';
import { Section, Para } from '@components/docs/DocComponents';
import { DOCS_NAV } from '@components/docs/nav';

const TOC = [
  { id: 'about',      label: 'About' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'formats',    label: 'Data Formats' },
  { id: 'explorer',   label: 'Explorer' },
];

const algoItems = DOCS_NAV.find(n => n.id === 'algorithms')?.children ?? [];
const fmtItems  = DOCS_NAV.find(n => n.id === 'formats')?.children ?? [];

export default function OverviewPage() {
  return (
    <DocPage
      title="Documentation"
      lead="Algorithms, data formats, datasets, and evaluation methods."
      toc={TOC}
    >
      <Section id="about">
        <Para>
          MachineLearning.js implements a selection of classic supervised and unsupervised machine
          learning algorithms entirely in JavaScript — no server required. Every computation runs
          in your browser.
        </Para>
        <Para>
          Algorithms and evaluation methods follow the descriptions in{' '}
          <a href="https://ml.cms.waikato.ac.nz/weka/book.html" target="_blank" rel="noreferrer"
            style={{ color: '#1565C0' }}>
            Data Mining: Practical Machine Learning Tools and Techniques
          </a>{' '}
          by Witten, Frank, Hall, Pal &amp; Foulds (University of Waikato).
          The ARFF file format is Weka&apos;s own invention.
        </Para>
      </Section>

      <Section id="algorithms" title="Learning Algorithms">
        <Para>
          Each algorithm page includes the original paper citation, a pseudocode description,
          and a Theory → Code walkthrough mapping the paper&apos;s steps to the JavaScript implementation.
        </Para>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
          {algoItems.map(({ id, label, href }) => (
            <Box key={id} component={Link} href={href}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none',
                p: 1.5, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2,
                '&:hover': { bgcolor: '#F5F8FF', borderColor: 'rgba(21,101,192,0.25)' },
                transition: 'all 0.15s',
              }}>
              <Chip label={label} size="small" color="primary" sx={{ pointerEvents: 'none' }} />
              <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.45)' }}>
                {id === 'knn'        && 'Lazy learner · Euclidean distance · majority vote'}
                {id === 'naivebayes' && "Probabilistic · Gaussian + Laplace smoothing · log-space"}
                {id === 'kmeans'     && "Unsupervised · Lloyd's algorithm · WCSS"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Section>

      <Section id="formats" title="Data Formats">
        <Para>
          The Explorer accepts ARFF and CSV files. Drop a file anywhere on the Explorer
          or use the <em>Open file</em> button.
        </Para>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
          {fmtItems.map(({ label, href }) => (
            <Box key={label} component={Link} href={href}
              sx={{
                px: 2, py: 1, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2,
                textDecoration: 'none', fontSize: 14, color: '#1565C0', fontWeight: 500,
                '&:hover': { bgcolor: '#F5F8FF' },
              }}>
              {label}
            </Box>
          ))}
        </Box>
      </Section>

      <Section id="explorer" title="Explorer">
        <Alert severity="info" sx={{ fontSize: 15 }}>
          Open the{' '}
          <Box component={Link} href="/explorer/"
            sx={{ color: 'inherit', fontWeight: 700, textDecoration: 'underline' }}>
            Explorer
          </Box>{' '}
          to load a dataset and try the algorithms interactively.
          Sample datasets are available in the Explorer&apos;s <strong>Sample</strong> dropdown.
        </Alert>
      </Section>
    </DocPage>
  );
}
