// k-Nearest Neighbours (IBk equivalent) — lazy learner, classifies at query time

function buildNorm(instances, attributes, classIndex) {
  const mins = {}, maxs = {};
  for (let i = 0; i < attributes.length; i++) {
    if (i === classIndex || attributes[i].type !== 'numeric') continue;
    let mn = Infinity, mx = -Infinity;
    for (const inst of instances) {
      if (inst[i] !== null) { mn = Math.min(mn, inst[i]); mx = Math.max(mx, inst[i]); }
    }
    mins[i] = mn; maxs[i] = mx;
  }
  return { mins, maxs };
}

function dist(a, b, attributes, classIndex, norm) {
  let sum = 0;
  for (let i = 0; i < attributes.length; i++) {
    if (i === classIndex) continue;
    if (a[i] === null || b[i] === null) { sum += 1; continue; }
    if (attributes[i].type === 'numeric') {
      const range = norm.maxs[i] - norm.mins[i] || 1;
      sum += ((a[i] - b[i]) / range) ** 2;
    } else {
      sum += a[i] === b[i] ? 0 : 1;
    }
  }
  return Math.sqrt(sum);
}

export function train(ds) {
  return { instances: ds.instances, attributes: ds.attributes, classIndex: ds.classIndex, norm: buildNorm(ds.instances, ds.attributes, ds.classIndex) };
}

export function classify(model, instance, k = 1) {
  const { instances, attributes, classIndex, norm } = model;
  const dists = instances.map(tr => ({ d: dist(tr, instance, attributes, classIndex, norm), c: tr[classIndex] }));
  dists.sort((a, b) => a.d - b.d);
  const votes = {};
  for (const { c } of dists.slice(0, k)) votes[c] = (votes[c] || 0) + 1;
  return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
}
