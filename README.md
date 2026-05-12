# machinelearning.js.org

A JavaScript reimagining of [Weka](https://ml.cms.waikato.ac.nz/weka/) — machine learning algorithms that run entirely in your browser. Nothing to install. Everything runs locally.

[![Live site](https://img.shields.io/badge/live-machinelearning.js.org-1565C0)](https://machinelearning.js.org)

## Features

- **Preprocess** — Upload CSV or ARFF datasets. Inspect attribute statistics, distributions, and missing values.
- **Classify** — Run k-NN and Naïve Bayes classifiers. Evaluate with cross-validation or a percentage hold-out split.
- **Cluster** — Discover structure with k-Means. Visualize cluster assignments and within-cluster variance.
- **Visualize** — Interactive 2-D scatter plots — select any two attributes and colour by class.

## Algorithms

| Algorithm | Type | Implementation |
|-----------|------|---------------|
| k-Nearest Neighbor | Classification | `lib/algorithms/knn.js` |
| Naïve Bayes | Classification | `lib/algorithms/naiveBayes.js` |
| k-Means | Clustering | `lib/algorithms/kmeans.js` |

## Data Formats

- **ARFF** (Weka's Attribute-Relation File Format) — sample datasets in `public/datasets/`
- **CSV** — first row treated as header; last column used as class attribute

## Running locally

```bash
npm install
npm run dev      # starts on http://localhost:3200
```

## Build and deploy

### How it works

The site is a [Next.js static export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).
`next build` writes the fully-rendered HTML/CSS/JS to `out/`.
That directory is what gets published to GitHub Pages — the `master` branch is source-only; the live site is served from the `gh-pages` branch.

```
master       ← all source code lives here
gh-pages     ← only the contents of out/ live here (managed automatically)
```

### Publish to production

```bash
# One command — builds the static export then pushes out/ to gh-pages:
npm run deploy
```

That runs `next build` (writes to `out/`) then uses the [`gh-pages`](https://github.com/tschaub/gh-pages) package to force-push `out/` to the `gh-pages` branch on origin with a single commit.

> GitHub Pages is configured (in the repo Settings → Pages) to serve from the `gh-pages` branch, root `/`.
> The custom domain is wired up via `public/CNAME` (`machinelearning.js.org`) which is copied into `out/` automatically during the build.
> `public/.nojekyll` is also copied, which tells GitHub Pages not to run Jekyll — required so the `_next/` static assets folder is served correctly.

### If you only want to build (no deploy)

```bash
npm run export   # produces out/ without touching the gh-pages branch
```

Useful for inspecting the static output locally:

```bash
npm run export
npx serve out   # or: python3 -m http.server 8080 -d out
```

### Committing source changes

Source lives on `master`. Normal workflow:

```bash
git add -p                          # stage changes
git commit -m "feat: description"
git push origin master              # push source
npm run deploy                      # separately push the built site to gh-pages
```

`git push origin master` and `npm run deploy` are independent — the deploy step only touches the `gh-pages` branch.

### Checking the live site

After `npm run deploy` completes (takes ~30 s for GitHub to propagate):

```
https://machinelearning.js.org
```

GitHub Actions is not used — the `gh-pages` npm package handles the push directly from your local machine.

## Inspired by

> Witten, Frank, Hall & Pal — *Data Mining: Practical Machine Learning Tools and Techniques* (4th ed.)
> University of Waikato

## Tech

Next.js 16 · Material UI v6 · Recharts · Material React Table · App Router · Static Export
