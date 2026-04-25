"use client";

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'SF Pro Display, SF Pro Icons, Helvetica Neue, Arial, sans-serif',
    fontSize: 14,
  },
  palette: {
    primary:    { main: '#00796B' },
    secondary:  { main: '#F57F17' },
    background: { default: '#F5F5F5', paper: '#FFFFFF' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#004D40',
          backgroundImage: "url('/images/header.png')",
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'repeat-x',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
});

export default theme;
