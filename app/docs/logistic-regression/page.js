"use client";

import { Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, StepLabel, Citation, ParamRow, BlockTex } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'parameters',  label: 'Parameters' },
  { id: 'notes',       label: 'Notes' },
];

export default function LogisticRegressionPage() {
  return (
    <DocPage
      title="Logistic Regression"
      lead="Models the probability of each class using a sigmoid (logistic) function, trained by minimising cross-entropy loss with gradient descent."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="The Regression Analysis of Binary Sequences"
          authors="D.R. Cox"
          venue="Journal of the Royal Statistical Society, Series B, Vol. 20"
          year="1958"
          url="https://www.jstor.org/stable/2983890"
          note="JSTOR — free with registration"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          Logistic Regression is a discriminative linear model. For binary classification it
          models P(y=1|x) = σ(w·x + b), where σ is the sigmoid function. The weights w and
          bias b are learned by minimising binary cross-entropy loss via gradient descent.
        </Para>
        <BlockTex label="Sigmoid" src="\sigma(z) = \frac{1}{1 + e^{-z}}" />
        <BlockTex label="Loss (binary cross-entropy),  zᵢ = w·xᵢ + b" src="L(\mathbf{w}, b) = -\frac{1}{n}\sum_{i}\bigl[y_i\log\sigma(z_i) + (1-y_i)\log(1-\sigma(z_i))\bigr]" />
        <BlockTex label="Gradient" src="\frac{\partial L}{\partial \mathbf{w}} = \frac{1}{n}X^\top\!\bigl(\sigma(X\mathbf{w}) - \mathbf{y}\bigr), \qquad \frac{\partial L}{\partial b} = \frac{1}{n}\sum_{i}(\sigma(z_i) - y_i)" />
        <BlockTex label="Update" src="\mathbf{w} \leftarrow \mathbf{w} - \eta\,\frac{\partial L}{\partial \mathbf{w}}, \qquad b \leftarrow b - \eta\,\frac{\partial L}{\partial b}" />
        <Para>
          Multi-class problems are handled with <strong>one-vs-rest (OvR)</strong>: one binary
          classifier is trained per class, and the class with the highest sigmoid score wins.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <StepLabel n={1} label="Sigmoid function — squashes any real number into (0, 1)" />
        <Code>{`function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }`}</Code>

        <StepLabel n={2} label="Gradient descent on cross-entropy for one binary classifier" />
        <Code>{`for (let epoch = 0; epoch < epochs; epoch++) {
  const dw = new Array(d).fill(0);
  let db = 0;
  for (let i = 0; i < n; i++) {
    const err = sigmoid(w.reduce((s, wj, j) => s + wj * X[i][j], b)) - y[i];
    for (let j = 0; j < d; j++) dw[j] += err * X[i][j];  // ∂L/∂w
    db += err;                                              // ∂L/∂b
  }
  for (let j = 0; j < d; j++) w[j] -= (learningRate / n) * dw[j];
  b -= (learningRate / n) * db;
}`}</Code>

        <StepLabel n={3} label="One-vs-rest — train one binary classifier per class value" />
        <Code>{`const classifiers = classValues.map(cv => {
  const y = instances.map(r => r[classIndex] === cv ? 1 : 0);  // 1 = this class, 0 = rest
  return { cv, ...trainBinary(X, y, d, learningRate, epochs) };
});`}</Code>

        <StepLabel n={4} label="Classify — return the class with the highest sigmoid score" />
        <Code>{`export function classify(model, instance) {
  const x = featureIdxs.map((fi, j) => ((instance[fi] ?? 0) - mins[j]) / ranges[j]);
  let best = null, bestScore = -Infinity;
  for (const { cv, w, b } of classifiers) {
    const score = sigmoid(w.reduce((s, wj, j) => s + wj * x[j], b));
    if (score > bestScore) { bestScore = score; best = cv; }
  }
  return best;
}`}</Code>
      </Section>

      <Section id="parameters" title="Parameters">
        <ParamRow label="Learning rate (η)" desc="Step size for gradient updates (default 0.1). Too large → diverge; too small → slow convergence." />
        <ParamRow label="Epochs" desc="Number of full passes over the training data (default 500)." />
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          Only <strong>numeric attributes</strong> are used as features in this implementation.
          Nominal attributes are currently ignored — convert them to numeric (e.g. one-hot encoding)
          before loading if they carry signal.
        </Para>
        <Para>
          <strong>Feature normalisation</strong> is applied automatically: each numeric attribute
          is scaled to [0, 1] using training-set min/max. This is essential for gradient descent
          to converge reliably across attributes with different scales.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          Logistic Regression provides calibrated probability estimates — unlike k-NN and Decision
          Trees, the sigmoid output can be interpreted as a confidence score.
        </Alert>
      </Section>
    </DocPage>
  );
}
