// Multilayer Perceptron: one hidden layer, sigmoid/softmax, full-batch backprop.
// Handles numeric (min-max normalized) and nominal (binary→single, k>2→one-hot) inputs.

function sigmoid(z) { return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z)))); }
function sigmoidD(a) { return a * (1 - a); }

function softmax(z) {
  const m = Math.max(...z);
  const e = z.map(v => Math.exp(v - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map(v => v / s);
}

function buildEncoders(attributes, instances, classIndex) {
  return attributes.map((attr, i) => {
    if (i === classIndex) return null;
    if (attr.type === 'numeric') {
      const vs = instances.map(r => r[i]).filter(v => v !== null);
      const min = Math.min(...vs), max = Math.max(...vs);
      return { type: 'numeric', min, max, range: max - min };
    }
    const vals = attr.values?.length
      ? attr.values
      : [...new Set(instances.map(r => r[i]).filter(v => v !== null))].sort();
    return vals.length <= 2 ? { type: 'binary', vals } : { type: 'onehot', vals };
  });
}

function encodeInstance(instance, encoders) {
  const x = [];
  for (let i = 0; i < encoders.length; i++) {
    const enc = encoders[i];
    if (!enc) continue;
    const v = instance[i];
    if (enc.type === 'numeric') {
      x.push(enc.range > 0 ? ((v ?? enc.min) - enc.min) / enc.range : 0.5);
    } else if (enc.type === 'binary') {
      x.push(enc.vals.indexOf(v) === 1 ? 1 : 0);
    } else {
      const idx = enc.vals.indexOf(v);
      enc.vals.forEach((_, j) => x.push(j === idx ? 1 : 0));
    }
  }
  return x;
}

export function train(ds, hiddenSize = null, epochs = 200, lr = 0.05) {
  const { attributes, instances, classIndex } = ds;
  const encoders = buildEncoders(attributes, instances, classIndex);

  const classAttr = attributes[classIndex];
  const classVals = classAttr.values?.length
    ? classAttr.values
    : [...new Set(instances.map(r => r[classIndex]).filter(v => v !== null))].sort();
  const C = classVals.length;

  const inputSize = encoders.reduce((s, enc) => {
    if (!enc) return s;
    return s + (enc.type === 'onehot' ? enc.vals.length : 1);
  }, 0);

  const inputNames = [];
  for (let i = 0; i < encoders.length; i++) {
    const enc = encoders[i];
    if (!enc) continue;
    if (enc.type === 'onehot') enc.vals.forEach(v => inputNames.push(`${attributes[i].name}=${v}`));
    else inputNames.push(attributes[i].name);
  }

  const H = hiddenSize ?? Math.max(2, Math.round((inputSize + C) / 2));

  // Glorot uniform init
  const s1 = Math.sqrt(6 / (inputSize + H));
  const s2 = Math.sqrt(6 / (H + C));
  const W1 = Array.from({ length: H * inputSize }, () => (Math.random() * 2 - 1) * s1);
  const b1 = new Array(H).fill(0);
  const W2 = Array.from({ length: C * H }, () => (Math.random() * 2 - 1) * s2);
  const b2 = new Array(C).fill(0);

  const rows = instances.filter(r => r[classIndex] !== null);
  const N = rows.length;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const dW1 = new Array(H * inputSize).fill(0);
    const db1 = new Array(H).fill(0);
    const dW2 = new Array(C * H).fill(0);
    const db2 = new Array(C).fill(0);

    for (const row of rows) {
      const ci = classVals.indexOf(row[classIndex]);
      if (ci < 0) continue;
      const x = encodeInstance(row, encoders);

      // Forward
      const a1 = Array.from({ length: H }, (_, h) => {
        let z = b1[h];
        for (let j = 0; j < inputSize; j++) z += W1[h * inputSize + j] * x[j];
        return sigmoid(z);
      });
      const z2 = Array.from({ length: C }, (_, c) => {
        let z = b2[c];
        for (let h = 0; h < H; h++) z += W2[c * H + h] * a1[h];
        return z;
      });
      const a2 = softmax(z2);

      // Backward: δ₂ = a₂ − one_hot(y)
      const d2 = a2.map((v, c) => v - (c === ci ? 1 : 0));

      for (let c = 0; c < C; c++) {
        for (let h = 0; h < H; h++) dW2[c * H + h] += d2[c] * a1[h];
        db2[c] += d2[c];
      }
      const d1 = Array.from({ length: H }, (_, h) => {
        let s = 0;
        for (let c = 0; c < C; c++) s += W2[c * H + h] * d2[c];
        return s * sigmoidD(a1[h]);
      });
      for (let h = 0; h < H; h++) {
        for (let j = 0; j < inputSize; j++) dW1[h * inputSize + j] += d1[h] * x[j];
        db1[h] += d1[h];
      }
    }

    const sc = lr / N;
    for (let i = 0; i < W1.length; i++) W1[i] -= sc * dW1[i];
    for (let i = 0; i < b1.length; i++) b1[i] -= sc * db1[i];
    for (let i = 0; i < W2.length; i++) W2[i] -= sc * dW2[i];
    for (let i = 0; i < b2.length; i++) b2[i] -= sc * db2[i];
  }

  return {
    W1, b1, W2, b2, H, inputSize, classCount: C,
    classVals, encoders,
    layerSizes: [inputSize, H, C],
    inputNames, outputNames: classVals,
  };
}

export function classify(model, instance) {
  const { W1, b1, W2, b2, H, inputSize, classCount, classVals, encoders } = model;
  const x = encodeInstance(instance, encoders);

  const a1 = Array.from({ length: H }, (_, h) => {
    let z = b1[h];
    for (let j = 0; j < inputSize; j++) z += W1[h * inputSize + j] * x[j];
    return sigmoid(z);
  });
  const z2 = Array.from({ length: classCount }, (_, c) => {
    let z = b2[c];
    for (let h = 0; h < H; h++) z += W2[c * H + h] * a1[h];
    return z;
  });
  const probs = softmax(z2);

  let best = 0;
  for (let c = 1; c < classCount; c++) if (probs[c] > probs[best]) best = c;
  return classVals[best];
}
