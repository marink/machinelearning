"use client";

import { Box, Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, SubHead, StepLabel, Citation, ParamRow } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'distance',    label: 'Distance Metric' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'parameters',  label: 'Parameters' },
  { id: 'evaluation',  label: 'Evaluation' },
];

export default function KnnPage() {
  return (
    <DocPage
      title="k-Nearest Neighbor"
      lead="A lazy learner that classifies new instances by majority vote of their k closest training examples."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Nearest Neighbor Pattern Classification"
          authors="T.M. Cover & P.E. Hart"
          venue="IEEE Transactions on Information Theory, Vol. 13"
          year="1967"
          url="https://doi.org/10.1109/TIT.1967.1053964"
          note="IEEE Xplore — institutional access may be required"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          k-NN is a lazy learner — it stores the entire training set and classifies a new instance
          by finding the k closest training examples (by distance) and taking a majority vote of
          their class labels. There is no training phase; all computation happens at query time.
        </Para>
        <Code>{`For a new instance x:
  1. Compute distance(x, xᵢ) for every training instance xᵢ
  2. Sort by distance, take the k smallest
  3. Return the most common class label among those k neighbours`}</Code>
        <Para>
          Cover &amp; Hart prove that the 1-NN error rate asymptotically cannot exceed twice the
          Bayes error rate — making k-NN a theoretical lower bound for non-parametric classification.
        </Para>
      </Section>

      <Section id="distance" title="Distance Metric">
        <Para>
          Numeric attributes use normalized Euclidean distance — each attribute is scaled to
          [0, 1] by its training-set min/max range so that no single attribute dominates.
          Nominal attributes use the overlap metric (0 if equal, 1 otherwise).
          Missing values contribute a worst-case penalty of 1.
        </Para>
        <Code>{`dist(a, b) = √Σᵢ dᵢ(aᵢ, bᵢ)²

numeric:  dᵢ = (aᵢ − bᵢ) / range(i)   (normalized Euclidean)
nominal:  dᵢ = 0 if aᵢ = bᵢ, else 1   (overlap)
missing:  dᵢ = 1                        (maximum penalty)`}</Code>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <Para>
          Four implementation steps map directly to the paper&apos;s assumptions:
        </Para>

        <StepLabel n={1} label="Normalize so attribute scale does not dominate distance" />
        <Code>{`// buildNorm() precomputes per-attribute min/max over the training set
const range = norm.maxs[i] - norm.mins[i] || 1;
sum += ((a[i] - b[i]) / range) ** 2;   // normalized Euclidean contribution`}</Code>

        <StepLabel n={2} label="Mixed-attribute distance — numeric, nominal, and missing values" />
        <Code>{`if (attributes[i].type === 'numeric') {
  sum += ((a[i] - b[i]) / range) ** 2;  // normalized Euclidean
} else {
  sum += a[i] === b[i] ? 0 : 1;         // overlap metric for nominal
}
// a[i] === null  →  sum += 1  (maximum possible distance contribution)`}</Code>

        <StepLabel n={3} label="Lazy model — the dataset IS the model (no training phase)" />
        <Code>{`export function train(ds) {
  // No learning happens here. train() captures the dataset and
  // precomputes normalization bounds — O(n·d) once, not per query.
  return { instances: ds.instances, attributes: ds.attributes,
           classIndex: ds.classIndex,
           norm: buildNorm(ds.instances, ds.attributes, ds.classIndex) };
}`}</Code>

        <StepLabel n={4} label="k-majority vote at classify time" />
        <Code>{`export function classify(model, instance, k = 1) {
  const dists = instances.map(tr => ({ d: dist(tr, instance, ...), c: tr[classIndex] }));
  dists.sort((a, b) => a.d - b.d);            // sort ascending by distance
  const votes = {};
  for (const { c } of dists.slice(0, k))     // tally top-k class labels
    votes[c] = (votes[c] || 0) + 1;
  return Object.entries(votes)
    .sort((a, b) => b[1] - a[1])[0][0];      // return plurality class
}`}</Code>
      </Section>

      <Section id="parameters" title="Parameters">
        <ParamRow label="k" desc="Number of neighbours. Default 3. Odd values avoid ties on binary classification tasks." />
      </Section>

      <Section id="evaluation" title="Evaluation">
        <Para>
          The Explorer supports leave-one-out cross-validation and a percentage hold-out split.
          Reported metrics include overall accuracy, confusion matrix, and per-class
          precision, recall, and F1 score.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          k-NN is sensitive to irrelevant attributes and non-normalised data. Try the Preprocess tab
          first to check attribute distributions.
        </Alert>
      </Section>
    </DocPage>
  );
}
