"use client";

import { Box, Alert } from '@mui/material';
import DocPage from '@components/docs/DocPage';
import {
  Section, Para, Code, StepLabel, Citation, ParamRow,
  BlockTex, Tex, Complexity, Theorem, Algo, Line, Kw,
} from '@components/docs/DocComponents';
import Link from 'next/link';

const TOC = [
  { id: 'paper',       label: 'Original Paper' },
  { id: 'algorithm',   label: 'Algorithm' },
  { id: 'score',       label: 'Cooper-Herskovits Score' },
  { id: 'walkthrough', label: 'Theory → Code' },
  { id: 'theory',      label: 'Theory' },
  { id: 'complexity',  label: 'Complexity' },
  { id: 'notes',       label: 'Notes' },
];

export default function K2Page() {
  return (
    <DocPage
      title="K2 Algorithm"
      lead="Greedy Bayesian network structure learning from discrete data — Cooper & Herskovits (1992). Given a node ordering, K2 greedily finds the parent set for each node that maximises the Cooper-Herskovits score."
      toc={TOC}
    >
      <Section id="paper">
        <Citation
          title="A Bayesian Method for the Induction of Probabilistic Networks from Data"
          authors="G.F. Cooper & E. Herskovits"
          venue="Machine Learning 9(4):309–347"
          year="1992"
          note="The paper that introduced the K2 algorithm and the Cooper-Herskovits scoring function"
        />
      </Section>

      <Section id="algorithm" title="Algorithm">
        <Para>
          A Bayesian network is a DAG where each node represents a discrete random variable
          and each directed edge encodes a direct probabilistic dependency. Structure learning
          asks: given a dataset, which DAG best explains it?
        </Para>
        <Para>
          The naive approach — evaluate all possible DAGs — is NP-hard. K2 makes it tractable
          with two constraints: (1) a fixed <em>node ordering</em> that restricts which nodes
          can be parents (earlier nodes only), and (2) a greedy hill-climbing search that adds
          one parent at a time, stopping when the score no longer improves.
        </Para>

        <Algo title="K2">
          <Line n={1}><Kw>Input:</Kw> dataset D, node ordering σ = (X₁, …, X_n), max parents u</Line>
          <Line n={2}><Kw>Output:</Kw> parent sets π_i for each node X_i</Line>
          <Line n={3}>&nbsp;</Line>
          <Line n={4}><Kw>for</Kw> i = 1 <Kw>to</Kw> n <Kw>do</Kw></Line>
          <Line n={5} indent={1}>π_i ← ∅;  P_old ← f(X_i, ∅)</Line>
          <Line n={6} indent={1}><Kw>while</Kw> |π_i| &lt; u <Kw>and</Kw> ∃ improvement <Kw>do</Kw></Line>
          <Line n={7} indent={2}>z* ← argmax_z f(X_i, π_i ∪ z)  <Kw>where</Kw> z ∈ &#123;σ[1..i-1]&#125; \ π_i</Line>
          <Line n={8} indent={2}><Kw>if</Kw> f(X_i, π_i ∪ z*) &gt; P_old</Line>
          <Line n={9} indent={3}>P_old ← f(X_i, π_i ∪ z*);  π_i ← π_i ∪ z*</Line>
          <Line n={10} indent={2}><Kw>else</Kw> break</Line>
          <Line n={11}><Kw>return</Kw> &#123;π_i&#125;</Line>
        </Algo>
      </Section>

      <Section id="score" title="Cooper-Herskovits Score">
        <Para>
          The score <Tex src="f(X_i, \pi_i)" /> is the marginal likelihood of the data
          given the structure, integrated over all possible CPT parameters with a uniform Dirichlet prior.
          For node <Tex src="X_i" /> with <Tex src="r_i" /> values, parent set <Tex src="\pi_i" />,
          and <Tex src="q_i = \prod_j |\pi_j|" /> parent configurations:
        </Para>
        <BlockTex
          label="Cooper-Herskovits scoring function"
          src="f(X_i, \pi_i) = \prod_{j=1}^{q_i} \frac{(r_i - 1)!}{(N_{ij} + r_i - 1)!} \prod_{k=1}^{r_i} \alpha_{ijk}!"
        />
        <Para>
          where <Tex src="N_{ij} = \sum_k \alpha_{ijk}" /> is the count of instances with
          the <Tex src="j" />-th parent configuration, and <Tex src="\alpha_{ijk}" /> is the
          count where additionally <Tex src="X_i = v_k" />.
        </Para>
        <Para>
          In log-space (avoiding factorial overflow):
        </Para>
        <BlockTex
          label="Log score (used in practice)"
          src="\log f(X_i,\pi_i) = \sum_{j=1}^{q_i}\!\Bigl[\log\Gamma(r_i) - \log\Gamma(N_{ij}+r_i) + \sum_{k=1}^{r_i}\log\Gamma(\alpha_{ijk}+1)\Bigr]"
        />
        <Para>
          Adding a parent either increases or decreases this score. K2 only adds a candidate
          parent when the score strictly improves — that is the hill-climbing stopping condition.
        </Para>
      </Section>

      <Section id="walkthrough" title="Theory → Code">
        <StepLabel n={1} label="Build a frequency table over the joint (node, parent config)" />
        <Code>{`// For each training instance, compute a string key for the parent config
// and increment the count for the observed node value.
for (const row of instances) {
  const key = parentIdxs.map(pi => row[pi]).join('\\0');
  table[key] ??= {};
  table[key][row[xi]] = (table[key][row[xi]] ?? 0) + 1;
}`}</Code>

        <StepLabel n={2} label="Evaluate the Cooper-Herskovits log score" />
        <Code>{`for (const config of allConfigs(parentVals)) {
  const counts = table[config.join('\\0')] ?? {};
  const Nij    = xiVals.reduce((s, v) => s + (counts[v] ?? 0), 0);

  // lgamma(r) − lgamma(Nij + r): normalisation term
  logScore += lgamma(r) - lgamma(Nij + r);

  // Σ_k lgamma(α_ijk + 1): observed-count terms
  for (const v of xiVals) logScore += lgamma((counts[v] ?? 0) + 1);
}`}</Code>

        <StepLabel n={3} label="Greedy parent search — add the best-scoring candidate" />
        <Code>{`let parents = [],  P_old = chScore(xi, [], ds);

while (parents.length < maxParents) {
  let best = -Infinity, bestZ = -1;
  // Only look at nodes earlier in the ordering (the K2 restriction)
  for (const z of ordering.slice(0, pos)) {
    if (parents.includes(z)) continue;
    const s = chScore(xi, [...parents, z], ds);
    if (s > best) { best = s; bestZ = z; }
  }
  if (bestZ < 0 || best <= P_old) break;   // no improvement — stop
  P_old = best;
  parents.push(bestZ);
}`}</Code>
      </Section>

      <Section id="theory" title="Theory">
        <Theorem n={1}>
          (Cooper & Herskovits, §3) Under a uniform Dirichlet parameter prior and
          a <em>Dirichlet-Markov condition</em> (parameter independence across nodes and parent
          configurations), the marginal likelihood of data D given structure{' '}
          <Tex src="B_S" /> factors as a product of per-node terms:
          <BlockTex src="P(D \mid B_S) = \prod_{i=1}^{n} f(X_i, \pi_i)" />
          making the K2 objective decomposable — scoring each node independently is globally valid.
        </Theorem>
        <Theorem n={2}>
          The greedy hill-climbing in K2 is not globally optimal. The ordering constraint
          removes all cycles but does not guarantee that the highest-scoring DAG consistent
          with the ordering is found — adding the locally best parent at each step may block
          a higher-scoring structure achievable by a different addition sequence.
          The search is polynomial in{' '}
          <Tex src="O(n^2 \cdot u)" /> rather than the NP-hard full structure enumeration.
        </Theorem>
      </Section>

      <Section id="complexity" title="Complexity">
        <Complexity rows={[
          { label: 'Score eval',    tex: 'O(n \\cdot 2^{|\\pi|})',  note: 'count table over instances per (node, parent set) pair' },
          { label: 'Per-node search', tex: 'O(n^2 \\cdot u)',       note: 'up to u parents, scanning n candidates each step' },
          { label: 'Total',          tex: 'O(n^3 \\cdot u)',        note: 'outer loop over n nodes' },
          { label: 'CPT size',       tex: 'O(r \\cdot 2^u)',        note: 'exponential in parents — motivates the u cap' },
        ]} />
      </Section>

      <Section id="notes" title="Notes">
        <Para>
          <strong>Ordering matters.</strong> K2 requires a topological ordering of the true
          network as input — if the ordering is wrong, K2 cannot recover the true structure even
          with infinite data. In practice, orderings are derived from domain knowledge or
          approximated with exhaustive search over orderings (which re-introduces NP-hardness).
        </Para>
        <Para>
          <strong>maxParents cap.</strong> The Cooper-Herskovits score prefers more parents
          when data is limited (overfitting), so a cap prevents degenerate structures.
          Typical values are 2–4 depending on dataset size.
        </Para>
        <Alert severity="info" sx={{ fontSize: 14, mb: 2 }}>
          Try K2 on the <strong>eczema dataset</strong> — it has a known 7-node structure
          (GeneticRisk + IrritantProducts → BrokenSkinBarrier; GeneticRisk + DustMiteExposure
          + HighSugarDiet → Th2Dysregulation; both → EczemaFlare). Load it in the{' '}
          <Link href="/explorer/" style={{ color: '#1565C0' }}>Explorer</Link> and compare
          the learned structure to the true DAG in the{' '}
          <Link href="/builder/" style={{ color: '#1565C0' }}>BN Builder</Link>.
        </Alert>
        <Para>
          <strong>K2 and the research arc.</strong> K2 was validated on the ALARM network —
          37 nodes and 46 edges representing an anaesthesia monitoring system.
          This remains the canonical benchmark for BN structure learning algorithms.
        </Para>
        <ParamRow name="ordering" type="number[]" default="[0, 1, …, n−1]"
          desc="Node indices in causal order. Earlier nodes can only be parents, not children." />
        <ParamRow name="maxParents" type="number" default="3"
          desc="Maximum parents per node. Caps CPT size and prevents overfitting on small datasets." />
      </Section>
    </DocPage>
  );
}
