// Linear Regression — Ordinary Least Squares via gradient descent
// Minimises MSE: L(w,b) = (1/n) Σ (ŷᵢ − yᵢ)²
// Requires a numeric class attribute.

// Step 1: Collect numeric feature indices and normalise both features and target.
// Normalisation keeps gradients well-scaled and speeds convergence.
function buildNorm(instances, featureIdxs, classIndex) {
  const mins  = featureIdxs.map(i => instances.reduce((m, r) => r[i] !== null ? Math.min(m, r[i]) : m, Infinity));
  const maxs  = featureIdxs.map(i => instances.reduce((m, r) => r[i] !== null ? Math.max(m, r[i]) : m, -Infinity));
  const ranges = mins.map((mn, j) => maxs[j] - mn || 1);
  const targets = instances.map(r => r[classIndex] ?? 0);
  const tMin = Math.min(...targets);
  const tMax = Math.max(...targets);
  const tRange = tMax - tMin || 1;
  return { mins, ranges, tMin, tRange };
}

// Step 2: Gradient descent — iteratively nudge weights in the direction that reduces MSE.
//   ∂L/∂w = (2/n) X^T (Xw − y)
//   ∂L/∂b = (2/n) Σ (ŷᵢ − yᵢ)
export function train(ds, learningRate = 0.05, epochs = 800) {
  const { instances, attributes, classIndex } = ds;
  const featureIdxs = attributes
    .map((a, i) => (i !== classIndex && a.type === 'numeric') ? i : -1)
    .filter(i => i >= 0);

  if (!featureIdxs.length) throw new Error('No numeric features for regression');

  const norm = buildNorm(instances, featureIdxs, classIndex);
  const { mins, ranges, tMin, tRange } = norm;

  const X = instances.map(r => featureIdxs.map((fi, j) => ((r[fi] ?? 0) - mins[j]) / ranges[j]));
  const y = instances.map(r => ((r[classIndex] ?? 0) - tMin) / tRange);
  const n = X.length;
  const d = featureIdxs.length;

  let w = new Array(d).fill(0);
  let b = 0;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const dw = new Array(d).fill(0);
    let db = 0;
    for (let i = 0; i < n; i++) {
      const err = w.reduce((s, wj, j) => s + wj * X[i][j], b) - y[i];
      for (let j = 0; j < d; j++) dw[j] += err * X[i][j];
      db += err;
    }
    for (let j = 0; j < d; j++) w[j] -= (learningRate / n) * dw[j];
    b -= (learningRate / n) * db;
  }

  return { w, b, featureIdxs, norm, attributes, classIndex };
}

// Step 3: Predict a continuous value by applying the learned linear function.
export function predict(model, instance) {
  const { w, b, featureIdxs, norm } = model;
  const { mins, ranges, tMin, tRange } = norm;
  const x = featureIdxs.map((fi, j) => ((instance[fi] ?? 0) - mins[j]) / ranges[j]);
  return x.reduce((s, xi, j) => s + w[j] * xi, b) * tRange + tMin;
}

// Step 4: Regression metrics — R², MAE, RMSE.
export function metrics(preds, actuals) {
  const n = preds.length;
  const mean = actuals.reduce((s, v) => s + v, 0) / n;
  const sse  = preds.reduce((s, p, i) => s + (p - actuals[i]) ** 2, 0);
  const sst  = actuals.reduce((s, a) => s + (a - mean) ** 2, 0);
  const mae  = preds.reduce((s, p, i) => s + Math.abs(p - actuals[i]), 0) / n;
  return {
    r2:   +(1 - sse / sst).toFixed(4),
    mae:  +(mae).toFixed(4),
    rmse: +(Math.sqrt(sse / n)).toFixed(4),
  };
}
