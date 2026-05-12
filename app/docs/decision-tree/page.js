"use client";

import { Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import { Section, Para, Code, StepLabel, Citation, ParamRow, Tex, BlockTex, Algo, Line, Kw, Complexity, Lemma, Proof } from '@components/docs/DocComponents';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'theory',      label: 'Theory' },
  { id: 'complexity',  label: 'Complexity' },
  { id: 'parameters',  label: 'Parameters' },
  { id: 'notes',       label: 'Notes' },
];

export default function DecisionTreePage() {
  return (
    <DocPage
      title="Decision Tree (ID3)"
      lead="Recursively splits the training data on the attribute that gives the highest information gain, building a tree that can be traversed at classify time."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="Induction of Decision Trees"
          authors="J.R. Quinlan"
          venue="Machine Learning, Vol. 1"
          year="1986"
          url="https://link.springer.com/article/10.1007/BF00116251"
          note="Springer — institutional access may be required"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          ID3 (Iterative Dichotomiser 3) builds a decision tree top-down by greedily selecting,
          at each node, the attribute that maximises information gain — the reduction in entropy
          when the data is partitioned by that attribute.
        </Para>
        <Algo title="Algorithm: ID3 BuildTree">
          <Line>BuildTree(<Tex src="S" />, <Tex src="A" />):</Line>
          <Line indent={1}><Kw>if</Kw> all instances in <Tex src="S" /> share one class → <Kw>return</Kw> Leaf(class)</Line>
          <Line indent={1}><Kw>if</Kw> <Tex src="A = \emptyset" /> or max depth → <Kw>return</Kw> Leaf(majority class in <Tex src="S" />)</Line>
          <Line indent={1}><Tex src="a^* \leftarrow \arg\max_{a \in A}\, IG(S, a)" /></Line>
          <Line indent={1}>create node splitting on <Tex src="a^*" /></Line>
          <Line indent={1}><Kw>for each</Kw> value <Tex src="v" /> of <Tex src="a^*" />:</Line>
          <Line indent={2}><Tex src="S_v \leftarrow \{\,\mathbf{x} \in S : \mathbf{x}[a^*] = v\,\}" /></Line>
          <Line indent={2}>attach BuildTree(<Tex src="S_v" />, <Tex src="A \setminus \{a^*\}" />) for branch <Tex src="v" /></Line>
        </Algo>
        <BlockTex label="Information Gain" src="IG(S,\, a) = H(S) - \sum_{v} \frac{|S_v|}{|S|} \cdot H(S_v)" />
        <BlockTex label="Shannon Entropy" src="H(S) = -\sum_{c} p_c \log_2 p_c" />
        <Para>
          <strong>Numeric attributes</strong> are handled with binary splits — the algorithm
          tries every midpoint between adjacent sorted values and picks the threshold with
          the highest information gain.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <Para>
          Four implementation steps map to Quinlan&apos;s paper:
        </Para>

        <StepLabel n={1} label="Entropy — measure impurity of a set of instances" />
        <Code>{`function entropy(instances, classIndex) {
  const counts = {};
  for (const inst of instances) {
    const c = inst[classIndex];
    if (c !== null) counts[c] = (counts[c] || 0) + 1;
  }
  const n = Object.values(counts).reduce((s, v) => s + v, 0);
  return Object.values(counts).reduce((s, v) => {
    const p = v / n;
    return s - p * Math.log2(p);   // H = -Σ p log₂p
  }, 0);
}`}</Code>

        <StepLabel n={2} label="Best split — find the threshold/value with maximum information gain" />
        <Code>{`// Numeric: try every midpoint between adjacent sorted values
for (let i = 0; i < sorted.length - 1; i++) {
  const t = (sorted[i][attrIdx] + sorted[i+1][attrIdx]) / 2;
  const gain = parentH
    - (left.length / n)  * entropy(left,  classIndex)
    - (right.length / n) * entropy(right, classIndex);
  if (gain > bestGain) { bestGain = gain; bestThreshold = t; }
}`}</Code>

        <StepLabel n={3} label="Recursive tree building — greedy top-down splitting" />
        <Code>{`function buildTree(instances, attributes, classIndex, usedNominal, maxDepth, depth) {
  // Stop: pure node, depth limit, or no gain available
  const pure = new Set(instances.map(i => i[classIndex]).filter(v => v !== null));
  if (pure.size <= 1 || depth >= maxDepth || instances.length <= 1)
    return { leaf: true, value: majorityClass(instances, classIndex) };

  // Pick attribute with highest information gain
  let bestAttr = -1, bestGain = 0;
  for (let i = 0; i < attributes.length; i++) {
    const { gain } = bestSplit(instances, i, attributes[i], classIndex);
    if (gain > bestGain) { bestGain = gain; bestAttr = i; }
  }

  if (bestAttr === -1) return { leaf: true, value: majorityClass(instances, classIndex) };
  // ... recurse into children
}`}</Code>

        <StepLabel n={4} label="Classify — traverse the tree by following branches" />
        <Code>{`export function classify(model, instance) {
  let node = model.tree;
  while (!node.leaf) {
    const val = instance[node.attrIdx];
    if (node.type === 'numeric') {
      node = (val !== null && val <= node.threshold) ? node.children.lte : node.children.gt;
    } else {
      node = node.children[val] ?? { leaf: true, value: node.fallback };
    }
  }
  return node.value;
}`}</Code>
      </Section>

      <Section id="theory" title="Theory">
        <Lemma n={1}>
          Information gain is non-negative: <Tex src="IG(S, a) \ge 0" /> for all attributes <Tex src="a" />.
        </Lemma>
        <Proof>
          Entropy <Tex src="H" /> is concave on probability distributions. By Jensen's inequality
          applied to the concave function <Tex src="H" />:
          <BlockTex src="H(S) \;\ge\; \sum_{v} \frac{|S_v|}{|S|} H(S_v)" />
          Therefore <Tex src="IG(S, a) = H(S) - \sum_v \frac{|S_v|}{|S|}H(S_v) \ge 0" />.
        </Proof>
        <Lemma n={2}>
          ID3 is guaranteed to reduce training error at each split, but provides no bound on
          generalisation error. The tree will overfit if grown without depth or leaf-size limits.
        </Lemma>
      </Section>

      <Section id="complexity" title="Complexity">
        <Complexity rows={[
          { label: 'Training',  tex: 'O(n \\cdot d \\cdot \\log n \\cdot h)', note: 'n instances, d attributes, h max depth' },
          { label: 'Query',     tex: 'O(h)',                                   note: 'single root-to-leaf traversal' },
          { label: 'Space',     tex: 'O(n)',                                   note: 'tree nodes proportional to training set' },
        ]} />
        <Para>
          At each node, scoring all <Tex src="d" /> attributes over the remaining <Tex src="n" /> instances
          costs <Tex src="O(n \cdot d)" />; with <Tex src="O(\log n)" /> nodes per level and depth <Tex src="h" />,
          total training is <Tex src="O(n \cdot d \cdot h \cdot \log n)" />.
          Numeric attributes add a <Tex src="O(n \log n)" /> sort per attribute per node.
        </Para>
      </Section>

      <Section id="parameters" title="Parameters">
        <ParamRow label="Max depth" desc="Maximum tree depth (default 20). Shallower trees are more interpretable but may underfit." />
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          <strong>Overfitting:</strong> ID3 grows trees until leaves are pure, which often
          overfits noisy training data. The max-depth limit is the only regularisation here.
          C4.5 (Quinlan&apos;s successor) adds post-pruning to address this.
        </Para>
        <Para>
          <strong>Bias toward high-cardinality attributes:</strong> Information gain favours
          attributes with many values. C4.5 corrects this with Gain Ratio instead of raw gain.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14 }}>
          Decision trees are highly interpretable — you can follow the path from root to leaf
          to understand exactly why an instance was classified as it was.
        </Alert>
      </Section>
    </DocPage>
  );
}
