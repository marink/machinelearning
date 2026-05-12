"use client";

import { Box, Typography, Chip, Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, SubHead } from '@components/docs/DocComponents';

const TOC = [
  { id: 'intro',    label: 'Introduction' },
  { id: 'structure', label: 'Structure' },
  { id: 'types',    label: 'Attribute Types' },
  { id: 'missing',  label: 'Missing Values' },
];

function AttrRow({ label, desc }) {
  return (
    <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Chip label={label} size="small" sx={{ fontFamily: 'monospace', mt: 0.2, flexShrink: 0 }} />
      <Typography sx={{ fontSize: 14, color: 'rgba(0,0,0,0.65)', lineHeight: 1.6 }}>{desc}</Typography>
    </Box>
  );
}

export default function ArffPage() {
  return (
    <DocPage
      title="ARFF Format"
      lead="The Attribute-Relation File Format — Weka's native dataset format, supported directly by the Explorer."
      toc={TOC}
    >
      <Section id="intro" title="Introduction">
        <Para>
          ARFF was developed by the Machine Learning Project at the University of Waikato for use
          with the Weka machine learning software. It is a human-readable ASCII text format that
          describes instances sharing a fixed set of attributes.
        </Para>
        <Para>
          An ARFF file has two sections: the <strong>Header</strong> (relation name and attribute
          declarations) and the <strong>Data</strong> section (one instance per line, comma-separated).
        </Para>
      </Section>

      <Section id="structure" title="Structure">
        <Code>{`% Comments start with %
% This is the classic Iris dataset

@relation iris

@attribute sepallength  numeric
@attribute sepalwidth   numeric
@attribute petallength  numeric
@attribute petalwidth   numeric
@attribute class        {Iris-setosa,Iris-versicolor,Iris-virginica}

@data
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
7.0,3.2,4.7,1.4,Iris-versicolor
...`}</Code>
        <Para>
          The <code style={{ fontFamily: 'monospace', fontSize: 13 }}>@relation</code> line names
          the dataset. Each <code style={{ fontFamily: 'monospace', fontSize: 13 }}>@attribute</code> line
          declares one attribute by name and type. The class attribute is conventionally last.
        </Para>
      </Section>

      <Section id="types" title="Attribute Types">
        <AttrRow label="numeric" desc="Continuous real-valued attributes. May also be declared as 'real' or 'integer'." />
        <AttrRow label="{v1,v2,...}" desc="Nominal (categorical) — lists all possible values in braces. Used for the class attribute." />
        <AttrRow label="string" desc="Free-form string values. Treated as nominal in this tool." />
        <AttrRow label="date" desc="Date/time values with an optional Java SimpleDateFormat pattern. Parsed as numeric timestamps." />
        <Para>
          For the full specification see the{' '}
          <a href="https://www.cs.waikato.ac.nz/ml/weka/arff.html" target="_blank" rel="noreferrer"
            style={{ color: '#1565C0' }}>
            official Weka ARFF documentation
          </a>.
        </Para>
      </Section>

      <Section id="missing" title="Missing Values">
        <Para>
          Missing values are represented by a question mark{' '}
          <code style={{ fontFamily: 'monospace', fontSize: 13 }}>?</code> in the data section.
          The Preprocess tab reports missing-value counts per attribute.
          During classification and clustering, missing values receive a maximum-distance penalty.
        </Para>
        <Code>{`% Instance with a missing value in the second attribute:
5.1,?,1.4,0.2,Iris-setosa`}</Code>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          Sample ARFF datasets are available in the Explorer via the <strong>Sample</strong> button,
          or on the <a href="/docs/datasets/" style={{ color: '#1565C0' }}>Datasets</a> page.
        </Alert>
      </Section>
    </DocPage>
  );
}
