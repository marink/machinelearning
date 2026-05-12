import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from '@theme';
import './globals.css';

export const metadata = {
  title: 'MachineLearning.js',
  description: 'Machine learning algorithms running entirely in your browser — no install required.',
  metadataBase: new URL('https://machinelearning.js.org'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
