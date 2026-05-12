// Logistic Regression — gradient descent on cross-entropy loss
// One-vs-rest for multi-class problems.
// Paper: Cox, D.R. (1958) "The regression analysis of binary sequences"
//   JRSS-B 20:215-242. Also: Bishop PRML §4.3 (free draft at microsoft.com/en-us/research)

// Step 1: Sigmoid maps the linear score to a probability in (0, 1).
function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

function buildNorm(instances, featureIdxs) {
  const mins  = featureIdxs.map(i => instances.reduce((m, r) => r[i] !== null ? Math.min(m, r[i]) : m,  Infinity));
  const maxs  = featureIdxs.map(i => instances.reduce((m, r) => r[i] !== null ? Math.max(m, r[i]) : m, -Infinity));
  return { mins, ranges: mins.map((mn, j) => maxs[j] - mn || 1) };
}

// Step 2: Gradient descent on binary cross-entropy for each one-vs-rest classifier.
//   ∂L/∂w = (1/n) X^T (σ(Xw) − y)
//   ∂L/∂b = (1/n) Σ (σ(z_i) − y_i)
function trainBinary(X, y, d, learningRate, epochs) {
  let w = new Array(d).fill(0);
  let b = 0;
  const n = X.length;
  for (let epoch = 0; epoch < epochs; epoch++) {
    const dw = new Array(d).fill(0);
    let db = 0;
    for (let i = 0; i < n; i++) {
      const err = sigmoid(w.reduce((s, wj, j) => s + wj * X[i][j], b)) - y[i];
      for (let j = 0; j < d; j++) dw[j] += err * X[i][j];
      db += err;
    }
    for (let j = 0; j < d; j++) w[j] -= (learningRate / n) * dw[j];
    b -= (learningRate / n) * db;
  }
  return { w, b };
}

export function train(ds, learningRate = 0.1, epochs = 500) {
  const { instances, attributes, classIndex } = ds;
  const classAttr = attributes[classIndex];
  const classValues = classAttr.values
    || [...new Set(instances.map(i => i[classIndex]).filter(v => v !== null))];

  const featureIdxs = attributes
    .map((a, i) => (i !== classIndex && a.type === 'numeric') ? i : -1)
    .filter(i => i >= 0);

  if (!featureIdxs.length) throw new Error('No numeric features for logistic regression');

  const norm = buildNorm(instances, featureIdxs);
  const { mins, ranges } = norm;

  const X = instances.map(r => featureIdxs.map((fi, j) => ((r[fi] ?? 0) - mins[j]) / ranges[j]));
  const d = featureIdxs.length;

  // Step 3: One-vs-rest — train one binary classifier per class value.
  const classifiers = classValues.map(cv => {
    const y = instances.map(r => r[classIndex] === cv ? 1 : 0);
    return { cv, ...trainBinary(X, y, d, learningRate, epochs) };
  });

  return { classifiers, featureIdxs, norm, attributes, classIndex };
}

// Step 4: Pick the class whose one-vs-rest sigmoid score is highest.
export function classify(model, instance) {
  const { classifiers, featureIdxs, norm } = model;
  const { mins, ranges } = norm;
  const x = featureIdxs.map((fi, j) => ((instance[fi] ?? 0) - mins[j]) / ranges[j]);
  let best = null, bestScore = -Infinity;
  for (const { cv, w, b } of classifiers) {
    const score = sigmoid(w.reduce((s, wj, j) => s + wj * x[j], b));
    if (score > bestScore) { bestScore = score; best = cv; }
  }
  return best;
}
