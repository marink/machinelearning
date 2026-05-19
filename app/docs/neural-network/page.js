"use client";

import DocPage from '@components/docs/DocPage';
import {
  Section, Para, Code, StepLabel, Citation, ParamRow,
  BlockTex, Tex, Complexity, Theorem, Algo, Line, Kw,
} from '@components/docs/DocComponents';
import Link from 'next/link';

const TOC = [
  { id: 'paper',        label: 'Original Paper' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'forward',      label: 'Forward Pass' },
  { id: 'backward',     label: 'Backpropagation' },
  { id: 'walkthrough',  label: 'Theory → Code' },
  { id: 'theory',       label: 'Theory' },
  { id: 'complexity',   label: 'Complexity' },
  { id: 'notes',        label: 'Notes' },
];

export default function NeuralNetworkPage() {
  return (
    <DocPage
      title="Neural Network (MLP)"
      lead="A Multilayer Perceptron with one hidden layer trained by stochastic gradient descent and backpropagation — Rumelhart, Hinton & Williams (1986). Learns non-linear decision boundaries by composing sigmoid activations in the hidden layer with a softmax output."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Learning representations by back-propagating errors"
          authors="D.E. Rumelhart, G.E. Hinton & R.J. Williams"
          venue="Nature 323:533–536"
          year="1986"
          url="https://www.nature.com/articles/323533a0"
          note="The paper that popularised backpropagation for multi-layer networks and launched the modern deep learning era"
        />
      </Section>

      <Section id="architecture" title="Architecture">
        <Para>
          The MLP implemented here has three layers: an <em>input layer</em>, one <em>hidden layer</em>,
          and an <em>output layer</em>. Each layer is fully connected to the next; there are no skip
          connections or recurrences.
        </Para>
        <Para>
          <strong>Input encoding.</strong> Nominal attributes with exactly two values are encoded as a
          single binary input (0 or 1). Nominal attributes with more than two values are one-hot encoded —
          a <Tex src="k" />-valued attribute produces <Tex src="k" /> inputs. Numeric attributes are
          min-max normalised to <Tex src="[0,1]" />. The class attribute is excluded from the input.
        </Para>
        <Para>
          <strong>Hidden layer size.</strong> When not specified, the hidden size defaults to{' '}
          <Tex src="H = \max\!\left(2,\;\bigl\lfloor (d + C) / 2 \bigr\rfloor\right)" />,
          where <Tex src="d" /> is the number of input features after encoding and <Tex src="C" /> is
          the number of classes. This is a common rule of thumb that sits between the input and output dimensions.
        </Para>
        <Para>
          <strong>Output layer.</strong> Each output neuron corresponds to one class. Raw logits are
          passed through softmax to produce a valid probability distribution over classes. The predicted
          class is the argmax of this distribution.
        </Para>
        <Algo title="MLP architecture">
          <Line><Kw>Layer 0 (input):</Kw>  d neurons — encoded feature vector x ∈ ℝ^d</Line>
          <Line><Kw>Layer 1 (hidden):</Kw> H neurons — z₁ = W₁x + b₁,  a₁ = σ(z₁)</Line>
          <Line><Kw>Layer 2 (output):</Kw> C neurons — z₂ = W₂a₁ + b₂,  a₂ = softmax(z₂)</Line>
          <Line>&nbsp;</Line>
          <Line><Kw>Parameters:</Kw> W₁ ∈ ℝ^(H×d), b₁ ∈ ℝ^H, W₂ ∈ ℝ^(C×H), b₂ ∈ ℝ^C</Line>
          <Line><Kw>Weights init:</Kw> Glorot uniform — U[−√(6/(fan_in+fan_out)), +√(6/(fan_in+fan_out))]</Line>
        </Algo>
      </Section>

      <Section id="forward" title="Forward Pass">
        <Para>
          Given an encoded input vector <Tex src="\mathbf{x} \in \mathbb{R}^d" />, the network
          computes predictions in two matrix-vector steps.
        </Para>
        <BlockTex
          label="Hidden layer pre-activation and activation"
          src="\mathbf{z}_1 = W_1\mathbf{x} + \mathbf{b}_1 \in \mathbb{R}^H, \qquad
               \mathbf{a}_1 = \sigma(\mathbf{z}_1) = \frac{1}{1+e^{-\mathbf{z}_1}}"
        />
        <BlockTex
          label="Output layer pre-activation and softmax"
          src="\mathbf{z}_2 = W_2\mathbf{a}_1 + \mathbf{b}_2 \in \mathbb{R}^C, \qquad
               \hat{y}_c = \frac{e^{z_{2,c}}}{\sum_{j=1}^{C} e^{z_{2,j}}}"
        />
        <Para>
          The predicted class is <Tex src="\hat{c} = \arg\max_c \hat{y}_c" />.
          Training minimises the <em>cross-entropy loss</em> summed over all training instances:
        </Para>
        <BlockTex
          label="Cross-entropy loss"
          src="\mathcal{L} = -\sum_{n=1}^{N} \log \hat{y}_{c_n}"
        />
        <Para>
          where <Tex src="c_n" /> is the true class index of instance <Tex src="n" />.
        </Para>
      </Section>

      <Section id="backward" title="Backpropagation">
        <Para>
          Gradients are computed by the chain rule, propagating the error signal from the output
          layer back through the hidden layer. The softmax + cross-entropy combination has a
          particularly clean combined derivative.
        </Para>
        <BlockTex
          label="Output layer error (combined softmax + cross-entropy gradient)"
          src="\boldsymbol{\delta}_2 = \hat{\mathbf{y}} - \mathbf{e}_{c}"
        />
        <Para>
          where <Tex src="\mathbf{e}_c" /> is the one-hot vector for the true class. This is the
          gradient of the cross-entropy loss with respect to the pre-activation <Tex src="\mathbf{z}_2" />.
        </Para>
        <BlockTex
          label="Output weight gradients"
          src="\frac{\partial \mathcal{L}}{\partial W_2} = \boldsymbol{\delta}_2 \mathbf{a}_1^\top,
               \qquad
               \frac{\partial \mathcal{L}}{\partial \mathbf{b}_2} = \boldsymbol{\delta}_2"
        />
        <BlockTex
          label="Hidden layer error (backpropagated through sigmoid)"
          src="\boldsymbol{\delta}_1 = \left(W_2^\top \boldsymbol{\delta}_2\right)
               \odot \sigma'(\mathbf{a}_1), \qquad \sigma'(a) = a(1-a)"
        />
        <BlockTex
          label="Hidden weight gradients"
          src="\frac{\partial \mathcal{L}}{\partial W_1} = \boldsymbol{\delta}_1 \mathbf{x}^\top,
               \qquad
               \frac{\partial \mathcal{L}}{\partial \mathbf{b}_1} = \boldsymbol{\delta}_1"
        />
        <Para>
          Weights are updated by full-batch gradient descent after accumulating gradients over all
          <Tex src="N" /> training instances:
        </Para>
        <BlockTex
          label="Parameter update"
          src="W \leftarrow W - \frac{\eta}{N} \nabla_W \mathcal{L}"
        />
        <Para>
          where <Tex src="\eta" /> is the learning rate. This implementation uses{' '}
          <Tex src="\eta = 0.05" /> and runs for 200 epochs by default.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <StepLabel n={1} label="Encode inputs — numeric normalisation and nominal one-hot" />
        <Code>{`function encodeInstance(instance, encoders) {
  const x = [];
  for (let i = 0; i < encoders.length; i++) {
    const enc = encoders[i];
    if (!enc) continue;                // skip class attribute
    const v = instance[i];
    if (enc.type === 'numeric') {
      x.push(enc.range > 0 ? ((v ?? enc.min) - enc.min) / enc.range : 0.5);
    } else if (enc.type === 'binary') {
      x.push(enc.vals.indexOf(v) === 1 ? 1 : 0);
    } else {                           // one-hot for k > 2
      const idx = enc.vals.indexOf(v);
      enc.vals.forEach((_, j) => x.push(j === idx ? 1 : 0));
    }
  }
  return x;
}`}</Code>

        <StepLabel n={2} label="Forward pass — sigmoid hidden, softmax output" />
        <Code>{`// Hidden layer: a1[h] = σ(W1[h,·]·x + b1[h])
const a1 = Array.from({ length: H }, (_, h) => {
  let z = b1[h];
  for (let j = 0; j < inputSize; j++) z += W1[h * inputSize + j] * x[j];
  return sigmoid(z);
});

// Output layer: a2 = softmax(W2·a1 + b2)
const z2 = Array.from({ length: C }, (_, c) => {
  let z = b2[c];
  for (let h = 0; h < H; h++) z += W2[c * H + h] * a1[h];
  return z;
});
const a2 = softmax(z2);   // probability distribution over C classes`}</Code>

        <StepLabel n={3} label="Backward pass — accumulate gradients, then update" />
        <Code>{`// δ₂ = a₂ − e_c  (combined softmax + cross-entropy derivative)
const d2 = a2.map((v, c) => v - (c === ci ? 1 : 0));

// Accumulate output weight gradients
for (let c = 0; c < C; c++) {
  for (let h = 0; h < H; h++) dW2[c * H + h] += d2[c] * a1[h];
  db2[c] += d2[c];
}

// Backpropagate through sigmoid: δ₁[h] = (Σ_c W2[c,h] δ₂[c]) · a₁[h](1−a₁[h])
const d1 = Array.from({ length: H }, (_, h) => {
  let s = 0;
  for (let c = 0; c < C; c++) s += W2[c * H + h] * d2[c];
  return s * a1[h] * (1 - a1[h]);   // sigmoidD
});
for (let h = 0; h < H; h++) {
  for (let j = 0; j < inputSize; j++) dW1[h * inputSize + j] += d1[h] * x[j];
  db1[h] += d1[h];
}

// Full-batch weight update after all N instances
const sc = lr / N;
for (let i = 0; i < W1.length; i++) W1[i] -= sc * dW1[i];
for (let i = 0; i < W2.length; i++) W2[i] -= sc * dW2[i];`}</Code>
      </Section>

      <Section id="theory" title="Theory">
        <Theorem n={1}>
          (Universal Approximation, Cybenko 1989; Hornik 1991) A feedforward network with a single
          hidden layer containing a finite number of neurons with a continuous, bounded,
          non-constant activation function can approximate any continuous function on a compact
          subset of <Tex src="\mathbb{R}^d" /> to arbitrary precision.
        </Theorem>
        <Para>
          Universal approximation guarantees <em>existence</em> but not <em>learnability</em> —
          gradient descent may converge to a poor local minimum, and the required number of hidden
          neurons may be exponentially large. In practice, depth (more layers) is far more
          parameter-efficient than width for complex functions.
        </Para>
        <Theorem n={2}>
          The combined gradient of cross-entropy loss with respect to softmax pre-activations is
          <Tex src="\boldsymbol{\delta}_2 = \hat{\mathbf{y}} - \mathbf{e}_c" />. This follows
          because the Jacobian of softmax cancels cleanly with the derivative of log-loss:
          <BlockTex src="\frac{\partial \mathcal{L}}{\partial z_{2,c}}
            = \hat{y}_c - \mathbf{1}[c = c_{\text{true}}]" />
          making the output gradient proportional to the prediction error — large when the network
          is wrong, near zero when it is confident and correct.
        </Theorem>
        <Para>
          <strong>Glorot initialisation.</strong> Initialising weights uniformly in{' '}
          <Tex src="\left[-\sqrt{6/(d_{\text{in}}+d_{\text{out}})},\;+\sqrt{6/(d_{\text{in}}+d_{\text{out}})}\right]" />
          {' '}keeps the variance of activations and gradients approximately constant across layers
          at the start of training, avoiding both vanishing and exploding gradients.
        </Para>
      </Section>

      <Section id="complexity" title="Complexity">
        <Complexity rows={[
          { label: 'Forward pass',   tex: 'O(N \\cdot (dH + HC))',  note: 'N instances, d inputs, H hidden, C classes' },
          { label: 'Backward pass',  tex: 'O(N \\cdot (dH + HC))',  note: 'same order as forward — two matrix-vector products' },
          { label: 'Per epoch',      tex: 'O(N \\cdot H \\cdot (d + C))', note: 'full batch over all instances' },
          { label: 'Total training', tex: 'O(E \\cdot N \\cdot H \\cdot (d + C))', note: 'E = 200 epochs default; scales linearly with data' },
          { label: 'Inference',      tex: 'O(dH + HC)',              note: 'single forward pass per instance' },
        ]} />
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          <strong>Full-batch vs mini-batch.</strong> This implementation uses full-batch gradient
          descent — gradients are accumulated over all N instances before each weight update. This is
          stable but slow on large datasets. Mini-batch SGD (batches of 32–256) is standard in
          practice and adds implicit regularisation through gradient noise.
        </Para>
        <Para>
          <strong>No regularisation.</strong> There is no weight decay, dropout, or early stopping.
          On small datasets (like iris or contact-lenses) the network may overfit when used in
          training-set evaluation mode. Cross-validation gives a fairer accuracy estimate.
        </Para>
        <Para>
          <strong>Sigmoid saturates.</strong> For large <Tex src="|z|" /> the sigmoid gradient
          approaches zero, slowing learning. The implementation clamps the sigmoid input to
          <Tex src="[-500, 500]" /> to avoid <code>Math.exp</code> overflow, but deep saturation
          is still possible without batch normalisation or ReLU activations.
        </Para>
        <Para>
          <strong>Network visualisation.</strong> After running Neural Network (MLP) in the{' '}
          <Link href="/explorer/" style={{ color: '#1565C0' }}>Explorer</Link>, switch to the
          Visualize tab and select <em>Network</em> to see the learned weight diagram. Edge colour
          encodes sign (red = positive, blue = negative) and opacity encodes magnitude.
        </Para>
        <ParamRow label="hiddenSize" desc="Number of hidden neurons H. Defaults to ⌊(d+C)/2⌋, minimum 2." />
        <ParamRow label="epochs" desc="Training iterations over the full dataset. Default: 200." />
        <ParamRow label="lr" desc="Learning rate η for gradient descent. Default: 0.05." />
      </Section>
    </DocPage>
  );
}
