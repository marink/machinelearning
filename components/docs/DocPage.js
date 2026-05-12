"use client";

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export default function DocPage({ title, lead, toc = [], children }) {
  const [activeId, setActiveId] = useState(toc[0]?.id ?? '');

  useEffect(() => {
    if (!toc.length) return;
    const observer = new IntersectionObserver(
      entries => {
        const hit = entries.find(e => e.isIntersecting);
        if (hit) setActiveId(hit.target.id);
      },
      { rootMargin: '-15% 0% -70% 0%', threshold: 0 },
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100%' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, minWidth: 0, py: 5, px: { xs: 3, md: 6 } }}>
        <Typography sx={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.025em', color: '#1d1d1f', mb: lead ? 0.5 : 3 }}>
          {title}
        </Typography>
        {lead && (
          <Typography sx={{ fontSize: 18, color: 'rgba(0,0,0,0.48)', mb: 4, fontWeight: 400, maxWidth: 680 }}>
            {lead}
          </Typography>
        )}
        {children}
      </Box>

      {/* Right TOC — desktop only */}
      {toc.length > 0 && (
        <Box sx={{
          display: { xs: 'none', lg: 'block' },
          width: 196,
          flexShrink: 0,
          position: 'sticky',
          top: 60,
          alignSelf: 'flex-start',
          pt: 5,
          pr: 3,
        }}>
          <Typography sx={{
            fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.32)',
            letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1.5,
          }}>
            On this page
          </Typography>
          {toc.map(({ id, label }) => (
            <Box
              key={id}
              component="a"
              href={`#${id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              sx={{
                display: 'block',
                fontSize: 13,
                py: 0.4,
                pl: 1.5,
                textDecoration: 'none',
                borderLeft: '2px solid',
                borderColor: activeId === id ? '#1565C0' : 'transparent',
                color: activeId === id ? '#1565C0' : 'rgba(0,0,0,0.48)',
                fontWeight: activeId === id ? 600 : 400,
                transition: 'color 0.15s, border-color 0.15s',
                '&:hover': { color: '#1d1d1f' },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
