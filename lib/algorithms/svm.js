// Support Vector Machine — linear soft-margin SVM with SGD on hinge loss
// One-vs-rest for multi-class problems.
// Paper: Cortes, C. & Vapnik, V. (1995) "Support Vector Networks"
//   Machine Learning 20(3):273-297. https://link.springer.com/article/10.1007/BF00994018

// Step 1: Hinge loss: L(w) = λ||w||² + C · Σ max(0, 1 − yᵢ(w·xᵢ + b))
// λ = 1/(C·n) controls the regularisation/margin tradeoff.

function buildNorm(instances, featureIdxs) {
  const mins  = featureIdxs.map(i => instances.reduce((m, r) => r[i] !== null ? Math.min(m, r[i]) : m,  Infinity));
  const maxs  = featureIdxs.map(i => instances.reduce((m, r) => r[i] !== null ? Math.max(m, r[i]) : m, -Infinity));
  return { mins, ranges: mins.map((mn, j) => maxs[j] - mn || 1) };
}

// Step 2: SGD update rule per epoch/instance.
//   If yᵢ(w·xᵢ + b) ≥ 1 (correctly outside margin): only regularise.
//   Else (hinge active):                               regularise + hinge gradient.
function trainBinary(X, y, d, C, epochs) {
  let w = new Array(d).fill(0);
  let b = 0;
  const n = X.length;
  const lambda = 1 / (C * n + 1e-9);

  for (let epoch = 0; epoch < epochs; epoch++) {
    const lr = 1 / (lambda * (epoch + 1));
    for (let i = 0; i < n; i++) {
      const score = w.reduce((s, wj, j) => s + wj * X[i][j], b) * y[i];
      if (score < 1) {
        w = w.map((wj, j) => (1 - 2 * lambda * lr) * wj + lr * C * y[i] * X[i][j]);
        b += lr * C * y[i];
      } else {
        w = w.map(wj => (1 - 2 * lambda * lr) * wj);
      }
    }
  }
  return { w, b };
}

// Step 3: Train one-vs-rest binary SVMs.
export function train(ds, C = 1.0, epochs = 500) {
  const { instances, attributes, classIndex } = ds;
  const classAttr = attributes[classIndex];
  const classValues = classAttr.values
    || [...new Set(instances.map(i => i[classIndex]).filter(v => v !== null))];

  const featureIdxs = attributes
    .map((a, i) => (i !== classIndex && a.type === 'numeric') ? i : -1)
    .filter(i => i >= 0);

  if (!featureIdxs.length) throw new Error('No numeric features for SVM');

  const norm = buildNorm(instances, featureIdxs);
  const { mins, ranges } = norm;

  const X = instances.map(r => featureIdxs.map((fi, j) => ((r[fi] ?? 0) - mins[j]) / ranges[j]));
  const d = featureIdxs.length;

  const classifiers = classValues.map(cv => {
    const y = instances.map(r => r[classIndex] === cv ? 1 : -1);
    return { cv, ...trainBinary(X, y, d, C, epochs) };
  });

  return { classifiers, featureIdxs, norm, attributes, classIndex };
}

// Step 4: Classify by taking argmax of the signed margin scores (decision values).
export function classify(model, instance) {
  const { classifiers, featureIdxs, norm } = model;
  const { mins, ranges } = norm;
  const x = featureIdxs.map((fi, j) => ((instance[fi] ?? 0) - mins[j]) / ranges[j]);
  let best = null, bestScore = -Infinity;
  for (const { cv, w, b } of classifiers) {
    const score = w.reduce((s, wj, j) => s + wj * x[j], b);
    if (score > bestScore) { bestScore = score; best = cv; }
  }
  return best;
}
