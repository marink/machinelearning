"use client";

import { Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, StepLabel, Citation, ParamRow, BlockTex, Algo, Line, Kw } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'parameters',  label: 'Parameters' },
  { id: 'output',      label: 'Output' },
];

export default function KMeansPage() {
  return (
    <DocPage
      title="k-Means Clustering"
      lead="Partitions instances into k clusters by iteratively assigning points to the nearest centroid and recomputing centroids until convergence."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Some Methods for Classification and Analysis of Multivariate Observations"
          authors="J.B. MacQueen"
          venue="Proc. 5th Berkeley Symposium on Mathematical Statistics and Probability"
          year="1967"
          url="https://projecteuclid.org/euclid.bsmsp/1200512992"
          note="Free — Project Euclid"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          k-Means is an unsupervised algorithm that groups instances into k clusters.
          It uses only numeric attributes (the class attribute is ignored).
          MacQueen&apos;s formulation is the standard Lloyd&apos;s algorithm:
        </Para>
        <Algo title="Algorithm: Lloyd's k-Means">
          <Line>1. Initialise <Kw>k</Kw> centroids by random sampling from the dataset</Line>
          <Line>2. <Kw>repeat until</Kw> no assignment changes (or maxIter reached):</Line>
          <Line indent={1}>a. Assign each instance to its nearest centroid (Euclidean distance)</Line>
          <Line indent={1}>b. Recompute each centroid as the mean of its assigned instances</Line>
          <Line>3. Report assignments, centroid values, cluster sizes, and WCSS</Line>
        </Algo>
        <Para>
          Lloyd&apos;s algorithm is guaranteed to converge in a finite number of steps because
          the number of possible assignments is finite and WCSS strictly decreases at each iteration.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <Para>
          Five stages of MacQueen&apos;s algorithm map to the implementation:
        </Para>

        <StepLabel n={1} label="Initialization — random instances as starting centroids" />
        <Code>{`// Shuffle the dataset and take the first k instances as seeds.
// Simple, avoids duplicate centroids, sufficient for small-to-medium datasets.
const shuffled = [...instances].sort(() => Math.random() - 0.5);
let centroids = shuffled.slice(0, k).map(inst => idxs.map(i => inst[i] ?? 0));`}</Code>

        <StepLabel n={2} label="Assignment step — argmin distance to centroid" />
        <Code>{`const newAssign = projected.map(p => {
  let best = 0, bestD = Infinity;
  for (let ki = 0; ki < k; ki++) {
    const d = centroidDist(p, centroids[ki], idxs.map((_, j) => j));
    if (d < bestD) { bestD = d; best = ki; }   // argmin over centroids
  }
  return best;
});`}</Code>

        <StepLabel n={3} label="Update step — recompute centroids as cluster means" />
        <Code>{`function updateCentroids(instances, assignments, k, idxs) {
  return Array.from({ length: k }, (_, ki) => {
    const members = instances.filter((_, j) => assignments[j] === ki);
    // Empty cluster: reassign to a random instance (avoids degenerate solutions)
    if (!members.length) return instances[Math.floor(Math.random() * instances.length)];
    return idxs.map(i => members.reduce((s, m) => s + (m[i] ?? 0), 0) / members.length);
  });
}`}</Code>

        <StepLabel n={4} label="Convergence check — stop when no assignments change" />
        <Code>{`const changed = newAssign.some((a, i) => a !== assignments[i]);
assignments = newAssign;
if (!changed) break;   // Lloyd's algorithm is guaranteed to converge`}</Code>

        <StepLabel n={5} label="WCSS — within-cluster sum of squares (objective function)" />
        <BlockTex src="\text{WCSS} = \sum_{k=1}^{K}\sum_{\mathbf{x}\,\in\, C_k} \|\mathbf{x} - \boldsymbol{\mu}_k\|^2" />
        <Code>{`const wcss = projected.reduce((s, p, j) =>
  s + idxs.reduce((s2, _, ii) =>
    s2 + (p[ii] - centroids[assignments[j]][ii]) ** 2, 0), 0);
// Lower WCSS → tighter clusters; only compare across models with the same k.`}</Code>
      </Section>

      <Section id="parameters" title="Parameters">
        <ParamRow label="k" desc="Number of clusters. Try several values and compare WCSS (elbow method) to choose." />
        <ParamRow label="Max iterations" desc="Safety cap (default 100). Most real datasets converge in under 20 iterations." />
      </Section>

      <Section id="output" title="Output">
        <Para>
          The Cluster tab reports cluster assignments for every instance, centroid values per
          attribute, cluster sizes, and the within-cluster sum of squares (WCSS).
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          WCSS always decreases as k increases — so comparing WCSS across different k values is only
          meaningful with an elbow plot. Look for the point where adding another cluster gives
          diminishing returns.
        </Alert>
      </Section>
    </DocPage>
  );
}
