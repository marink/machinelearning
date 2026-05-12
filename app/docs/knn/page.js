"use client";

import { Box, Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, SubHead, StepLabel, Citation, ParamRow, Tex, BlockTex, Algo, Line, Kw, Complexity, Theorem, Corollary } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'distance',    label: 'Distance Metric' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'theory',      label: 'Theory' },
  { id: 'complexity',  label: 'Complexity' },
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
        <Algo title="Algorithm: k-NN Classify">
          <Line><Kw>for</Kw> each training instance <Tex src="\mathbf{x}_i" />: compute <Tex src="d(\mathbf{x},\, \mathbf{x}_i)" /></Line>
          <Line>Sort by distance; select the <Tex src="k" /> nearest neighbours <Tex src="\mathcal{N}_k(\mathbf{x})" /></Line>
          <Line><Kw>return</Kw> <Tex src="\arg\max_c \;\#\{c \in \mathcal{N}_k(\mathbf{x})\}" /> (majority vote)</Line>
        </Algo>
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
        <BlockTex src="d(\mathbf{a},\, \mathbf{b}) = \sqrt{\sum_{i} d_i(a_i, b_i)^2}" />
        <Algo title="Per-attribute distance dᵢ">
          <Line>numeric: <Tex src="d_i = \dfrac{a_i - b_i}{\operatorname{range}(i)}" /> (normalised Euclidean)</Line>
          <Line>nominal: <Tex src="d_i = 0 \text{ if } a_i = b_i,\; \text{else } 1" /> (overlap metric)</Line>
          <Line>missing: <Tex src="d_i = 1" /> (maximum penalty)</Line>
        </Algo>
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

      <Section id="theory" title="Theory">
        <Theorem n={1}>
          (Cover &amp; Hart, 1967) Let <Tex src="R^*" /> be the Bayes error rate and <Tex src="R_1" /> the
          1-NN error rate. As the training set size <Tex src="n \to \infty" />:
        </Theorem>
        <BlockTex src="R^* \;\le\; R_1 \;\le\; 2R^*\!\left(1 - R^*\right) \;\le\; 2R^*" />
        <Para>
          The upper bound shows 1-NN can never be worse than twice the Bayes error — making
          it a theoretical lower bound on classification difficulty for any non-parametric method.
        </Para>
        <Corollary n={1}>
          For odd <Tex src="k" /> with <Tex src="k \to \infty" /> and <Tex src="k/n \to 0" /> as <Tex src="n \to \infty" />,
          the k-NN error rate converges to the Bayes error rate <Tex src="R^*" />.
        </Corollary>
      </Section>

      <Section id="complexity" title="Complexity">
        <Complexity rows={[
          { label: 'Training',  tex: 'O(n \\cdot d)',        note: 'store dataset, precompute per-attribute min/max' },
          { label: 'Query',     tex: 'O(n \\cdot d)',        note: 'full distance scan; no index structure' },
          { label: 'Space',     tex: 'O(n \\cdot d)',        note: 'entire training set kept in memory' },
        ]} />
        <Para>
          k-NN pays no cost at training time — all work happens at query time. For large datasets,
          approximate nearest-neighbour structures (kd-trees, ball trees) reduce query cost to
          <Tex src="O(d \log n)" /> on average, but are not implemented here.
        </Para>
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
