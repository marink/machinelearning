"use client";

import { Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, StepLabel, Citation, ParamRow, Tex, BlockTex, Algo, Line, Kw } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'parameters',  label: 'Parameters' },
  { id: 'notes',       label: 'Notes' },
];

export default function SvmPage() {
  return (
    <DocPage
      title="Support Vector Machine"
      lead="Finds the maximum-margin hyperplane separating classes, with a soft-margin penalty for misclassifications — trained by stochastic gradient descent on hinge loss."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Support Vector Networks"
          authors="C. Cortes & V. Vapnik"
          venue="Machine Learning, Vol. 20"
          year="1995"
          url="https://link.springer.com/article/10.1007/BF00994018"
          note="Springer — institutional access may be required"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          A linear SVM finds the hyperplane w·x + b = 0 that separates classes with the largest
          possible margin (2/‖w‖). The <strong>soft-margin</strong> variant (Cortes & Vapnik)
          allows misclassifications via slack variables ξᵢ, controlled by the penalty parameter C.
        </Para>
        <BlockTex label="Primal objective (soft-margin)" src="\min_{\mathbf{w},\,b}\;\tfrac{1}{2}\|\mathbf{w}\|^2 + C\sum_{i}\xi_i \quad \text{s.t.}\quad y_i(\mathbf{w}\cdot\mathbf{x}_i + b) \ge 1 - \xi_i,\;\xi_i \ge 0" />
        <BlockTex label="Hinge loss (equivalent unconstrained form)" src="L(\mathbf{w}, b) = \lambda\|\mathbf{w}\|^2 + C\sum_{i}\max\!\bigl(0,\;1 - y_i(\mathbf{w}\cdot\mathbf{x}_i + b)\bigr),\quad \lambda = \tfrac{1}{Cn}" />
        <Algo title="SGD update per instance">
          <Line><Kw>if</Kw> <Tex src="y_i(\mathbf{w}\cdot\mathbf{x}_i + b) \ge 1" />:</Line>
          <Line indent={1}><Tex src="\mathbf{w} \leftarrow (1 - 2\lambda\eta)\,\mathbf{w}" /> (L2 regularise only)</Line>
          <Line><Kw>else</Kw>:</Line>
          <Line indent={1}><Tex src="\mathbf{w} \leftarrow (1 - 2\lambda\eta)\,\mathbf{w} + \eta C y_i \mathbf{x}_i" /> (regularise + hinge)</Line>
          <Line indent={1}><Tex src="b \leftarrow b + \eta C y_i" /></Line>
        </Algo>
        <Para>
          Multi-class problems use <strong>one-vs-rest</strong>: one SVM per class. The class
          whose decision function w·x + b gives the highest score wins.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <StepLabel n={1} label="Hinge loss — zero when correctly classified outside the margin" />
        <Code>{`// Hinge loss contribution for instance i:
//   max(0, 1 − yᵢ · (w·xᵢ + b))
// = 0  if the point is on the correct side and beyond the margin
// > 0  if the point is inside or on the wrong side of the margin
const score = w.reduce((s, wj, j) => s + wj * X[i][j], b) * y[i];
const hingeActive = score < 1;`}</Code>

        <StepLabel n={2} label="SGD with decaying learning rate per epoch" />
        <Code>{`for (let epoch = 0; epoch < epochs; epoch++) {
  const lr = 1 / (lambda * (epoch + 1));  // decaying schedule

  for (let i = 0; i < n; i++) {
    const score = w.reduce((s, wj, j) => s + wj * X[i][j], b) * y[i];
    if (score < 1) {
      // Hinge active: regularise + margin correction
      w = w.map((wj, j) => (1 - 2 * lambda * lr) * wj + lr * C * y[i] * X[i][j]);
      b += lr * C * y[i];
    } else {
      // Hinge inactive: only regularise (shrink weights toward zero)
      w = w.map(wj => (1 - 2 * lambda * lr) * wj);
    }
  }
}`}</Code>

        <StepLabel n={3} label="One-vs-rest — train one linear SVM per class" />
        <Code>{`const classifiers = classValues.map(cv => {
  const y = instances.map(r => r[classIndex] === cv ? 1 : -1);  // SVM uses +1/-1
  return { cv, ...trainBinary(X, y, d, C, epochs) };
});`}</Code>

        <StepLabel n={4} label="Classify — argmax of the raw margin scores" />
        <Code>{`export function classify(model, instance) {
  const x = featureIdxs.map((fi, j) => ((instance[fi] ?? 0) - mins[j]) / ranges[j]);
  let best = null, bestScore = -Infinity;
  for (const { cv, w, b } of classifiers) {
    const score = w.reduce((s, wj, j) => s + wj * x[j], b);  // signed margin
    if (score > bestScore) { bestScore = score; best = cv; }
  }
  return best;
}`}</Code>
      </Section>

      <Section id="parameters" title="Parameters">
        <ParamRow label="C" desc="Regularisation strength (default 1.0). High C → smaller margin, fewer misclassifications. Low C → wider margin, more slack." />
        <ParamRow label="Epochs" desc="SGD passes over training data (default 500). More epochs → finer convergence." />
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          This implementation is a <strong>linear SVM</strong> only — it learns a hyperplane
          boundary. Kernel SVMs (RBF, polynomial) can separate non-linearly separable data but
          require computing a kernel matrix; they are not yet implemented here.
        </Para>
        <Para>
          Only <strong>numeric attributes</strong> are used as features. Feature normalisation
          to [0, 1] is applied automatically — this is critical for SGD convergence and for the
          margin to be meaningful across attributes.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          SVMs excel in high-dimensional spaces and work well even when features outnumber
          instances. They tend to be sensitive to C — try a few values (0.1, 1, 10) to tune.
        </Alert>
      </Section>
    </DocPage>
  );
}
