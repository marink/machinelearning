export const DOCS_NAV = [
  { id: 'overview',  label: 'Overview',           href: '/docs/' },
  {
    id: 'algorithms', label: 'Learning Algorithms', group: true,
    children: [
      { divider: 'Classification' },
      { id: 'knn',                 label: 'k-Nearest Neighbor',    href: '/docs/knn/' },
      { id: 'naivebayes',          label: 'Naïve Bayes',           href: '/docs/naivebayes/' },
      { id: 'decision-tree',       label: 'Decision Tree (ID3)',   href: '/docs/decision-tree/' },
      { id: 'logistic-regression', label: 'Logistic Regression',   href: '/docs/logistic-regression/' },
      { id: 'svm',                 label: 'Support Vector Machine',href: '/docs/svm/' },
      { id: 'neural-network',      label: 'Neural Network (MLP)',  href: '/docs/neural-network/' },
      { divider: 'Regression' },
      { id: 'linear-regression',   label: 'Linear Regression',     href: '/docs/linear-regression/' },
      { divider: 'Clustering' },
      { id: 'kmeans',              label: 'k-Means Clustering',    href: '/docs/kmeans/' },
      { divider: 'Structure Learning' },
      { id: 'k2',                  label: 'K2 Algorithm',          href: '/docs/k2/' },
    ],
  },
  {
    id: 'formats',   label: 'Data Formats',        group: true,
    children: [
      { id: 'arff', label: 'ARFF Format', href: '/docs/arff/' },
      { id: 'csv',  label: 'CSV Format',  href: '/docs/csv/' },
    ],
  },
  { id: 'datasets', label: 'Sample Datasets',     href: '/docs/datasets/' },
];

// Flat ordered list for prev/next — excludes dividers and group headers
export const DOCS_FLAT = DOCS_NAV.flatMap(item =>
  item.group ? item.children.filter(c => !c.divider) : [item]
);
