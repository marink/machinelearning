"use client";

import { Box, Typography, Chip } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para } from '@components/docs/DocComponents';

const TOC = [
  { id: 'intro',    label: 'Introduction' },
  { id: 'book',     label: 'Book Examples' },
  { id: 'uci',      label: 'UCI Classics' },
  { id: 'bn',       label: 'Bayesian Networks' },
];

const DATASETS = [
  {
    group: 'book',
    name: 'Iris',
    instances: 150, attrs: 4, task: 'Classification',
    desc: 'The most famous dataset in machine learning. Measurements of sepal and petal length and width for three iris species (setosa, versicolor, virginica), 50 instances each. Introduced by R.A. Fisher in 1936.',
    arff: '/datasets/iris.arff',
    uci: 'https://archive.ics.uci.edu/dataset/53/iris',
    sample: true,
  },
  {
    group: 'book',
    name: 'Weather (Nominal)',
    instances: 14, attrs: 4, task: 'Classification',
    desc: 'The canonical toy dataset from the Weka book. Predicts whether conditions are suitable to play golf based on outlook, temperature, humidity, and wind. Used throughout the book to illustrate decision trees and Naïve Bayes.',
    arff: '/datasets/weather.arff',
    uci: null,
    sample: true,
  },
  {
    group: 'book',
    name: 'Contact Lenses',
    instances: 24, attrs: 4, task: 'Classification',
    desc: 'All possible combinations of four nominal attributes for recommending soft, hard, or no contact lenses. Small but complete — no missing values.',
    arff: '/datasets/contact-lenses.arff',
    uci: 'https://archive.ics.uci.edu/dataset/58/lenses',
    sample: true,
  },
  {
    group: 'book',
    name: 'Labor Relations',
    instances: 57, attrs: 16, task: 'Classification',
    desc: 'Final settlements from Canadian labor negotiations (1987–1988). Mixed numeric and nominal attributes covering wages, hours, pension, and leave. Classifies contracts as acceptable or not.',
    arff: '/datasets/labor.arff',
    uci: 'https://archive.ics.uci.edu/dataset/57/labor+relations',
    sample: true,
  },
  {
    group: 'uci',
    name: 'Pima Indians Diabetes',
    instances: 768, attrs: 8, task: 'Classification',
    desc: 'Medical records from the National Institute of Diabetes for Pima Indian women aged 21+. Attributes include glucose concentration, blood pressure, BMI, insulin level, and diabetes pedigree function.',
    arff: '/datasets/diabetes.arff',
    uci: 'https://archive.ics.uci.edu/dataset/34/diabetes',
    sample: true,
  },
  {
    group: 'uci',
    name: 'Congressional Voting Records',
    instances: 435, attrs: 16, task: 'Classification',
    desc: '1984 U.S. House of Representatives voting records on 16 key issues. Each instance is a member of Congress classified as Democrat or Republican.',
    arff: '/datasets/vote.arff',
    uci: 'https://archive.ics.uci.edu/dataset/105/congressional+voting+records',
    sample: true,
  },
  {
    group: 'uci',
    name: 'Glass Identification',
    instances: 214, attrs: 9, task: 'Classification',
    desc: 'Chemical composition measurements for 214 glass samples from crime scene investigations. Six glass types including float/non-float window glass, containers, tableware, and headlamps.',
    arff: '/datasets/glass.arff',
    uci: 'https://archive.ics.uci.edu/dataset/42/glass+identification',
    sample: true,
  },
  {
    group: 'uci',
    name: 'Ionosphere',
    instances: 351, attrs: 34, task: 'Classification',
    desc: 'Radar returns from a phased array of 16 HF antennas targeting free electrons in the ionosphere. Returns classified as "good" (evidence of structure) or "bad" (pass-throughs). 34 continuous attributes.',
    arff: '/datasets/ionosphere.arff',
    uci: 'https://archive.ics.uci.edu/dataset/52/ionosphere',
    sample: true,
  },
  {
    group: 'uci',
    name: 'Image Segmentation',
    instances: 210, attrs: 19, task: 'Classification',
    desc: 'Each instance is a 3×3-pixel region drawn from seven outdoor images. 19 continuous attributes describe spectral and geometric properties. Seven classes: brickface, sky, foliage, cement, window, path, grass.',
    arff: '/datasets/segment-challenge.arff',
    uci: 'https://archive.ics.uci.edu/dataset/50/image+segmentation',
    sample: true,
  },
  {
    group: 'bn',
    name: 'Eczema / Atopic Dermatitis',
    instances: 500, attrs: 7, task: 'Classification',
    desc: 'Synthetic dataset forward-sampled from a 7-node Bayesian Network with a known causal structure: GeneticRisk + IrritantProducts → BrokenSkinBarrier; GeneticRisk + DustMiteExposure + HighSugarDiet → Th2Dysregulation; both → EczemaFlare. Designed for K2 structure learning — the true DAG is recoverable. ~25% positive (flare) class rate.',
    arff: '/datasets/eczema.arff',
    uci: null,
    sample: true,
  },
  {
    group: 'uci',
    name: 'Adult (Census Income)',
    instances: 48842, attrs: 14, task: 'Classification',
    desc: 'Extracted from the 1994 U.S. Census Bureau database. Predicts whether annual income exceeds $50,000 based on age, education, occupation, marital status, and hours worked. Widely used for bias and fairness research.',
    arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/adult.arff',
    uci: 'https://archive.ics.uci.edu/dataset/2/adult',
    sample: false,
  },
  {
    group: 'uci',
    name: 'German Credit (credit-g)',
    instances: 1000, attrs: 20, task: 'Classification',
    desc: 'Credit risk classification for applicants at a German bank. Mixed attributes cover credit history, loan purpose, employment, and savings. Misclassifying a bad risk as good is five times more costly.',
    arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/credit-g.arff',
    uci: 'https://archive.ics.uci.edu/dataset/144/statlog+german+credit+data',
    sample: false,
  },
  {
    group: 'uci',
    name: 'Hypothyroid',
    instances: 3772, attrs: 30, task: 'Classification',
    desc: 'Patient records for diagnosing thyroid disorders. Seven continuous attributes (TSH, T3, TT4, T4U, FTI, age) and 23 nominal attributes. Four classes: negative, compensated, primary, and secondary hypothyroid.',
    arff: 'https://storm.cis.fordham.edu/~gweiss/data-mining/weka-data/hypothyroid.arff',
    uci: 'https://archive.ics.uci.edu/dataset/102/thyroid+disease',
    sample: false,
  },
];

function DatasetCard({ ds }) {
  return (
    <Box sx={{ mb: 2, p: 2.5, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, bgcolor: '#FAFAFA' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', mr: 0.5 }}>{ds.name}</Typography>
        <Chip label={`${ds.instances.toLocaleString()} instances`} size="small" variant="outlined" />
        <Chip label={`${ds.attrs} attrs`} size="small" variant="outlined" />
        <Chip label={ds.task} size="small" color="primary" />
        {ds.sample && <Chip label="in Explorer" size="small" color="success" variant="outlined" />}
      </Box>
      <Typography sx={{ fontSize: 14, color: 'rgba(0,0,0,0.62)', mb: 1.5, lineHeight: 1.65 }}>
        {ds.desc}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <a href={ds.arff} target={ds.arff.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer" download={!ds.arff.startsWith('http') || undefined}
          style={{ color: '#1565C0', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
          ↓ ARFF
        </a>
        {ds.uci && (
          <a href={ds.uci} target="_blank" rel="noreferrer"
            style={{ color: '#1565C0', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
            UCI Repository →
          </a>
        )}
      </Box>
    </Box>
  );
}

export default function DatasetsPage() {
  const bookSets = DATASETS.filter(d => d.group === 'book');
  const uciSets  = DATASETS.filter(d => d.group === 'uci');
  const bnSets   = DATASETS.filter(d => d.group === 'bn');

  return (
    <DocPage
      title="Sample Datasets"
      lead="Classic benchmarks from the UCI Machine Learning Repository, used throughout the Witten & Frank book."
      toc={TOC}
    >
      <Section id="intro">
        <Para>
          Datasets marked <strong>in Explorer</strong> are available directly from the Explorer&apos;s
          <strong> Sample</strong> dropdown — no download needed.
          Others can be downloaded as ARFF and loaded via <em>Open file</em> or drag-and-drop.
        </Para>
        <Para>
          ARFF files are served locally from this site or from{' '}
          <a href="https://storm.cis.fordham.edu/~gweiss/data-mining/datasets.html"
            target="_blank" rel="noreferrer" style={{ color: '#1565C0' }}>
            Fordham University&apos;s archive
          </a>.
          UCI links go to the original repository pages with full documentation.
        </Para>
      </Section>

      <Section id="book" title="Book Examples">
        <Para>
          These datasets appear throughout{' '}
          <em>Data Mining: Practical Machine Learning Tools and Techniques</em> as running examples.
        </Para>
        {bookSets.map(ds => <DatasetCard key={ds.name} ds={ds} />)}
      </Section>

      <Section id="uci" title="UCI Classics">
        <Para>
          Widely used benchmarks from the{' '}
          <a href="https://archive.ics.uci.edu/" target="_blank" rel="noreferrer"
            style={{ color: '#1565C0' }}>
            UCI Machine Learning Repository
          </a>.
        </Para>
        {uciSets.map(ds => <DatasetCard key={ds.name} ds={ds} />)}
      </Section>

      <Section id="bn" title="Bayesian Networks">
        <Para>
          Synthetic datasets generated from known Bayesian Network structures.
          Use these with the <a href="/docs/k2/" style={{ color: '#1565C0' }}>K2 algorithm</a> to
          learn structure from data and compare the learned DAG against the true network in
          the <a href="/builder/" style={{ color: '#1565C0' }}>BN Builder</a>.
        </Para>
        {bnSets.map(ds => <DatasetCard key={ds.name} ds={ds} />)}
      </Section>
    </DocPage>
  );
}
