# machinelearning.js.org

A JavaScript reimagining of [Weka](https://ml.cms.waikato.ac.nz/weka/) — machine learning algorithms that run entirely in your browser. Nothing to install. Everything runs locally.

[![Live site](https://img.shields.io/badge/live-machinelearning.js.org-00796B)](https://machinelearning.js.org)

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
npm run dev      # starts on port 3200
```

## Deploying

```bash
npm run deploy   # builds static export and pushes to gh-pages
```

## Inspired by

> Witten, Frank, Hall & Pal — *Data Mining: Practical Machine Learning Tools and Techniques* (4th ed.)
> University of Waikato

![Data Mining: Practical Machine Learning Tools and Techniques](https://www.cs.waikato.ac.nz/~ml/images/Book4thEd.jpg)

## Tech

Next.js 16 · Material UI v6 · Recharts · App Router · Static Export
