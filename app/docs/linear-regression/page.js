"use client";

import { Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, StepLabel, Citation, ParamRow } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Reference' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'parameters',  label: 'Parameters' },
  { id: 'metrics',     label: 'Evaluation Metrics' },
  { id: 'notes',       label: 'Notes' },
];

export default function LinearRegressionPage() {
  return (
    <DocPage
      title="Linear Regression"
      lead="Models a numeric target as a weighted sum of input features, minimising mean squared error via gradient descent."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Pattern Recognition and Machine Learning — Chapter 3"
          authors="C.M. Bishop"
          venue="Springer (free draft available from Microsoft Research)"
          year="2006"
          url="https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf"
          note="Free PDF"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          Linear Regression models the target y as a linear function of the feature vector x:
          ŷ = w·x + b. The weights w and bias b minimise mean squared error (MSE) over the
          training set. This implementation uses gradient descent on the MSE loss.
        </Para>
        <Code>{`Model:   ŷᵢ = w·xᵢ + b

Loss:    L(w,b) = (1/n) Σ (ŷᵢ − yᵢ)²   (Mean Squared Error)

Gradient:
  ∂L/∂w = (2/n) X^T (Xw − y)
  ∂L/∂b = (2/n) Σ (ŷᵢ − yᵢ)

Update:
  w ← w − η · ∂L/∂w
  b ← b − η · ∂L/∂b`}</Code>
        <Para>
          The closed-form <strong>Normal Equations</strong> solution — w = (XᵀX)⁻¹Xᵀy — is
          mathematically equivalent but requires a matrix inverse that is numerically unstable
          for ill-conditioned feature sets. Gradient descent is preferred for general use.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <StepLabel n={1} label="Normalise features and target to [0,1] for stable convergence" />
        <Code>{`// Per-attribute min/max over training set
const mins  = featureIdxs.map(i => instances.reduce((m, r) => Math.min(m, r[i] ?? m), Infinity));
const ranges = mins.map((mn, j) => maxs[j] - mn || 1);

// Target normalisation
const tMin = Math.min(...targets);
const tRange = Math.max(...targets) - tMin || 1;
const y = instances.map(r => ((r[classIndex] ?? 0) - tMin) / tRange);`}</Code>

        <StepLabel n={2} label="Gradient descent — update weights by MSE gradient" />
        <Code>{`for (let epoch = 0; epoch < epochs; epoch++) {
  const dw = new Array(d).fill(0);
  let db = 0;
  for (let i = 0; i < n; i++) {
    const err = w.reduce((s, wj, j) => s + wj * X[i][j], b) - y[i]; // ŷᵢ − yᵢ
    for (let j = 0; j < d; j++) dw[j] += err * X[i][j];  // ∂L/∂wⱼ
    db += err;                                              // ∂L/∂b
  }
  for (let j = 0; j < d; j++) w[j] -= (learningRate / n) * dw[j];
  b -= (learningRate / n) * db;
}`}</Code>

        <StepLabel n={3} label="Predict — un-normalise the output back to original scale" />
        <Code>{`export function predict(model, instance) {
  const x = featureIdxs.map((fi, j) => ((instance[fi] ?? 0) - mins[j]) / ranges[j]);
  const normPred = x.reduce((s, xi, j) => s + w[j] * xi, b);
  return normPred * tRange + tMin;   // rescale back to original target units
}`}</Code>

        <StepLabel n={4} label="Regression metrics — R², MAE, RMSE" />
        <Code>{`export function metrics(preds, actuals) {
  const n = preds.length;
  const mean = actuals.reduce((s, v) => s + v, 0) / n;
  const sse  = preds.reduce((s, p, i) => s + (p - actuals[i]) ** 2, 0);
  const sst  = actuals.reduce((s, a) => s + (a - mean) ** 2, 0);
  return {
    r2:   1 - sse / sst,                     // coefficient of determination
    mae:  preds.reduce((s, p, i) => s + Math.abs(p - actuals[i]), 0) / n,
    rmse: Math.sqrt(sse / n),
  };
}`}</Code>
      </Section>

      <Section id="parameters" title="Parameters">
        <ParamRow label="Learning rate (η)" desc="Gradient step size (default 0.05). Lower values are safer but slower to converge." />
        <ParamRow label="Epochs" desc="Number of full gradient passes (default 800). Watch for R² plateau to judge convergence." />
      </Section>

      <Section id="metrics" title="Evaluation Metrics">
        <Para>
          <strong>R² (coefficient of determination)</strong> — proportion of variance in the
          target explained by the model. R²=1 is a perfect fit; R²=0 means the model does no
          better than predicting the mean; negative R² means it&apos;s worse.
        </Para>
        <Para>
          <strong>MAE (mean absolute error)</strong> — average absolute difference between
          predicted and actual values, in the same units as the target.
        </Para>
        <Para>
          <strong>RMSE (root mean squared error)</strong> — square root of MSE; penalises large
          errors more than MAE, also in target units.
        </Para>
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          Only <strong>numeric attributes</strong> are used as features. The class attribute
          must also be numeric (regression task). If the class is nominal, use a classifier instead.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          Linear Regression is available in the Explorer&apos;s Classify tab when the dataset has a
          numeric class attribute. The tab automatically switches between classification
          and regression algorithms based on the class type.
        </Alert>
      </Section>
    </DocPage>
  );
}
