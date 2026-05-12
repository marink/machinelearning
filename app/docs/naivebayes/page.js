"use client";

import { Box, Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, SubHead, StepLabel, Citation, ParamRow } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'notes',       label: 'Notes' },
];

export default function NaiveBayesPage() {
  return (
    <DocPage
      title="Naïve Bayes"
      lead="Applies Bayes' theorem under conditional independence: Gaussian for numeric attributes, Laplace-smoothed counts for nominal."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Estimating Continuous Distributions in Bayesian Classifiers"
          authors="G.H. John & P. Langley"
          venue="UAI-95 — 11th Conference on Uncertainty in Artificial Intelligence"
          year="1995"
          url="https://arxiv.org/abs/1302.4964"
          note="Free PDF on arXiv"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          Naïve Bayes applies Bayes&apos; theorem with the assumption that all attributes are
          conditionally independent given the class. Despite this rarely being true in practice,
          it often performs surprisingly well — especially on text and high-dimensional data.
        </Para>
        <Code>{`P(class | x) ∝ P(class) × ∏ P(xᵢ | class)

Numeric attributes — Gaussian distribution (John & Langley §3):
  P(xᵢ | class) = (1/√(2πσ²)) × exp(−(x − μ)² / 2σ²)

Nominal attributes — Laplace-smoothed frequency counts:
  P(xᵢ = v | class) = (count(v in class) + 1) / (count(class) + |values|)`}</Code>
        <Para>
          John &amp; Langley&apos;s key contribution is extending the classic discrete Naïve Bayes
          model to handle continuous attributes with Gaussian density estimation, making it practical
          for real-world datasets with mixed attribute types.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <Para>
          Four steps map John &amp; Langley&apos;s formulation to the implementation:
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
// Prevents P(unseen value | class) = 0 from wiping out the posterior.
const counts = {};
for (const v of attrVals) counts[v] = 1;            // Laplace prior
for (const v of vals)     counts[v] = (counts[v] || 1) + 1;
likelihoods[cv][i] = { counts, total: vals.length + attrVals.length };

// At classify time:
logP += Math.log((lk.counts[instance[i]] || 1) / lk.total);`}</Code>

        <StepLabel n={4} label="Classify in log-probability space — prevents floating-point underflow" />
        <Code>{`let logP = Math.log(priors[cv]);           // log P(class)
for (let i = 0; i < attributes.length; i++) {
  if (attributes[i].type === 'numeric')
    logP += gaussianLog(instance[i], lk.mean, lk.variance);
  else
    logP += Math.log((lk.counts[instance[i]] || 1) / lk.total);
}
if (logP > bestScore) { bestScore = logP; best = cv; }  // argmax`}</Code>
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          <strong>Laplace smoothing</strong> prevents zero-probability issues for nominal values
          not seen during training for a given class. Without it, a single unseen value drives
          the entire posterior to zero regardless of all other evidence.
        </Para>
        <Para>
          The <strong>variance floor</strong> (<code style={{ fontFamily: 'monospace', fontSize: 13 }}>1e-9</code>)
          prevents division by zero in the Gaussian formula when all training instances in a class
          share exactly the same value for a numeric attribute.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          Naïve Bayes trains in a single pass over the data — O(n·d) — making it very fast
          even on large datasets. It&apos;s a good baseline before trying more complex models.
        </Alert>
      </Section>
    </DocPage>
  );
}
