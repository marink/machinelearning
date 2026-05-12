"use client";

import { Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code } from '@components/docs/DocComponents';

const TOC = [
  { id: 'format',   label: 'Format' },
  { id: 'example',  label: 'Example' },
  { id: 'behavior', label: 'Behavior' },
];

export default function CsvPage() {
  return (
    <DocPage
      title="CSV Format"
      lead="Plain comma-separated values — the Explorer infers attribute types automatically from the data."
      toc={TOC}
    >
      <Section id="format" title="Format">
        <Para>
          CSV files must have a header row as the first line. Column names become attribute names.
          The <strong>last column</strong> is treated as the class attribute.
          No special declarations are required — the parser infers types from the values.
        </Para>
      </Section>

      <Section id="example" title="Example">
        <Code>{`sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,setosa
4.9,3.0,1.4,0.2,setosa
7.0,3.2,4.7,1.4,versicolor
6.3,3.3,6.0,2.5,virginica`}</Code>
      </Section>

      <Section id="behavior" title="Behavior">
        <Para>
          <strong>Type inference:</strong> A column is treated as <em>numeric</em> if every
          non-empty value parses as a finite number; otherwise it is treated as <em>nominal</em>.
        </Para>
        <Para>
          <strong>Missing values:</strong> Empty cells are counted during preprocessing and
          receive a maximum-distance penalty during classification and clustering.
        </Para>
        <Para>
          <strong>Class attribute:</strong> The last column is always used as the class.
          If you need a different column to be the class, reorder your CSV before loading.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          For richer control over attribute types and class selection, convert your CSV to{' '}
          <a href="/docs/arff/" style={{ color: '#1565C0' }}>ARFF format</a>.
        </Alert>
      </Section>
    </DocPage>
  );
}
