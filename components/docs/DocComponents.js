"use client";

import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

export function Section({ id, title, children }) {
  return (
    <Box id={id} component="section" sx={{ mb: 6, scrollMarginTop: '68px' }}>
      {title && (
        <>
          <Typography sx={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', color: '#1d1d1f', mb: 0.75 }}>
            {title}
          </Typography>
          <Divider sx={{ mb: 2.5, borderColor: 'rgba(0,0,0,0.08)' }} />
        </>
      )}
      {children}
    </Box>
  );
}

export function Code({ children }) {
  return (
    <Paper variant="outlined" sx={{
      p: 2, my: 2,
      fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
      fontSize: 13,
      bgcolor: '#F5F5F7',
      whiteSpace: 'pre',
      overflowX: 'auto',
      borderColor: 'rgba(0,0,0,0.1)',
      borderRadius: 2,
    }}>
      {children}
    </Paper>
  );
}

export function Para({ children }) {
  return (
    <Typography sx={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(0,0,0,0.7)', mb: 2 }}>
      {children}
    </Typography>
  );
}

export function SubHead({ children }) {
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', mb: 1, mt: 2.5, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11 }}>
      {children}
    </Typography>
  );
}

export function StepLabel({ n, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2.5, mb: 0.5 }}>
      <Box sx={{
        width: 22, height: 22, borderRadius: '50%', bgcolor: '#1565C0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{n}</Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f' }}>{label}</Typography>
    </Box>
  );
}

export function Citation({ title, authors, venue, year, url, note }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderColor: 'rgba(21,101,192,0.3)', bgcolor: '#F0F4FF', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <MenuBookIcon sx={{ color: '#1565C0', mt: 0.25, flexShrink: 0, fontSize: 20 }} />
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1d1d1f', mb: 0.25, fontStyle: 'italic' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', mb: 0.75 }}>
            {authors} · {venue} · {year}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href={url} target="_blank" rel="noreferrer"
              style={{ color: '#1565C0', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}>
              View paper →
            </a>
            {note && (
              <Typography component="span" sx={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
                {note}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export function ParamRow({ label, desc }) {
  return (
    <Box sx={{ mb: 1.5 }}>
      <Chip label={label} size="small" color="primary" sx={{ mr: 1 }} />
      <Typography component="span" sx={{ fontSize: 15, color: 'rgba(0,0,0,0.65)' }}>{desc}</Typography>
    </Box>
  );
}
