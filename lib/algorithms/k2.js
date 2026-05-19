// K2: Cooper & Herskovits (1992) Bayesian structure learning for discrete BNs
// "A Bayesian Method for the Induction of Probabilistic Networks from Data"
// Machine Learning 9(4):309-347.
//
// Assumes all attributes are nominal/discrete (numeric attrs are skipped).
// Returns the learned DAG as parent sets + edges.

// ── log Γ(n) for positive integers n (memoized) ──────────────────────────────
// Γ(n) = (n-1)!  so  log Γ(n) = Σ_{k=2}^{n-1} log k
// Recurrence: lgamma(n) = lgamma(n-1) + log(n-1),  lgamma(1) = lgamma(2) = 0
const _lg = [NaN, 0, 0]; // index = n; _lg[0] unused
function lgamma(n) {
  if (n < _lg.length) return _lg[n];
  for (let i = _lg.length; i <= n; i++) _lg.push(_lg[i - 1] + Math.log(i - 1));
  return _lg[n];
}

// ── Distinct values helper ────────────────────────────────────────────────────
function getVals(attr, instances, idx) {
  return attr.values?.length
    ? attr.values
    : [...new Set(instances.map(r => r[idx]).filter(v => v != null))].sort();
}

// ── Enumerate all parent-config value combinations ────────────────────────────
function allConfigs(parentValsArr) {
  if (parentValsArr.length === 0) return [[]];
  const rest = allConfigs(parentValsArr.slice(1));
  return parentValsArr[0].flatMap(v => rest.map(c => [v, ...c]));
}

// ── Cooper-Herskovits log score for (node xi, parent set) ─────────────────────
// f(i,π) = Σ_j [ lgamma(r_i) − lgamma(N_ij + r_i) + Σ_k lgamma(α_ijk + 1) ]
// Higher score = better-supported structure.
function chScore(xi, parentIdxs, ds) {
  const { attributes, instances } = ds;

  const xiVals      = getVals(attributes[xi], instances, xi);
  const parentVals  = parentIdxs.map(pi => getVals(attributes[pi], instances, pi));
  const r           = xiVals.length;
  if (r < 2) return 0;

  // Build joint frequency table: configKey (parent combo) → {val: count}
  const table = {};
  for (const row of instances) {
    if (row[xi] == null) continue;
    if (parentIdxs.some(pi => row[pi] == null)) continue;
    const key = parentIdxs.map(pi => row[pi]).join('\0');
    if (!table[key]) table[key] = {};
    const v = row[xi];
    table[key][v] = (table[key][v] || 0) + 1;
  }

  let logScore = 0;
  for (const config of allConfigs(parentVals)) {
    const key    = config.join('\0');
    const counts = table[key] || {};
    const Nij    = xiVals.reduce((s, v) => s + (counts[v] || 0), 0);
    logScore    += lgamma(r) - lgamma(Nij + r);
    for (const v of xiVals) logScore += lgamma((counts[v] || 0) + 1);
  }
  return logScore;
}

// ── K2 structure learning ─────────────────────────────────────────────────────
// ordering: array of attr indices in search order (default: 0..n-1).
//           For node at ordering[i], candidate parents are ordering[0..i-1].
// maxParents: stop adding parents once a node has this many (caps CPT growth).
// Returns:
//   structure: { [attrIdx]: [parentAttrIdxs] }   — learned parent sets
//   edges:     [{ from, to, fromLabel, toLabel }] — for visualisation
//   scores:    { [attrIdx]: finalLogScore }
export function k2(ds, ordering = null, maxParents = 3) {
  const { attributes } = ds;
  const n = attributes.length;

  if (!ordering) ordering = Array.from({ length: n }, (_, i) => i);

  const structure = {};
  const scores    = {};

  for (let pos = 0; pos < ordering.length; pos++) {
    const xi = ordering[pos];

    // Skip numeric attributes — K2 requires discrete variables
    if (attributes[xi].type === 'numeric') {
      structure[xi] = [];
      scores[xi]    = 0;
      continue;
    }

    let parents  = [];
    let P_old    = chScore(xi, parents, ds);
    let improved = true;

    while (improved && parents.length < maxParents) {
      improved = false;
      let bestScore  = -Infinity;
      let bestParent = -1;

      // Candidate parents: earlier in ordering, not already a parent, discrete only
      for (let j = 0; j < pos; j++) {
        const z = ordering[j];
        if (parents.includes(z)) continue;
        if (attributes[z].type === 'numeric') continue;

        const s = chScore(xi, [...parents, z], ds);
        if (s > bestScore) { bestScore = s; bestParent = z; }
      }

      if (bestParent >= 0 && bestScore > P_old) {
        P_old    = bestScore;
        parents  = [...parents, bestParent];
        improved = true;
      }
    }

    structure[xi] = parents;
    scores[xi]    = P_old;
  }

  // Build edge list for visualisation
  const edges = [];
  for (const [to, parents] of Object.entries(structure)) {
    for (const from of parents) {
      edges.push({
        from: Number(from),
        to:   Number(to),
        fromLabel: attributes[Number(from)].name,
        toLabel:   attributes[Number(to)].name,
      });
    }
  }

  return { structure, edges, scores };
}
