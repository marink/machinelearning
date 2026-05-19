"use client";

import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import katex from 'katex';

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

// ── KaTeX math rendering ───────────────────────────────────────────────────

function renderTex(src, display) {
  try {
    return katex.renderToString(src, { throwOnError: false, displayMode: display });
  } catch {
    return src;
  }
}

export function Tex({ src }) {
  return (
    <Box
      component="span"
      dangerouslySetInnerHTML={{ __html: renderTex(src, false) }}
      sx={{ verticalAlign: 'baseline' }}
    />
  );
}

export function BlockTex({ src, label }) {
  return (
    <Box sx={{ my: 2 }}>
      {label && (
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.38)', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Box
        dangerouslySetInnerHTML={{ __html: renderTex(src, true) }}
        sx={{
          overflowX: 'auto',
          py: 1,
          px: 2,
          bgcolor: '#F8F9FB',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 2,
        }}
      />
    </Box>
  );
}

// ── Algorithm pseudocode block ─────────────────────────────────────────────

export function Algo({ title, children }) {
  return (
    <Paper variant="outlined" sx={{
      my: 2, borderRadius: 2, overflow: 'hidden',
      borderColor: 'rgba(0,0,0,0.12)',
      borderLeft: '3px solid #1565C0',
    }}>
      {title && (
        <Box sx={{ px: 2.5, py: 0.75, bgcolor: '#F0F4FF', borderBottom: '1px solid rgba(21,101,192,0.15)' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#1565C0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </Typography>
        </Box>
      )}
      <Box sx={{ px: 2.5, py: 1.75, display: 'flex', flexDirection: 'column', gap: 0.3, bgcolor: '#FAFBFF' }}>
        {children}
      </Box>
    </Paper>
  );
}

export function Line({ indent = 0, children }) {
  return (
    <Box sx={{ pl: indent * 2.5, lineHeight: 1.8 }}>
      <Typography component="span" sx={{ fontSize: 14.5, color: '#1d1d1f', fontFamily: 'inherit' }}>
        {children}
      </Typography>
    </Box>
  );
}

export function Kw({ children }) {
  return (
    <Box component="span" sx={{ fontWeight: 600, fontStyle: 'italic', color: '#1565C0' }}>
      {children}
    </Box>
  );
}

// ── Complexity table ───────────────────────────────────────────────────────

export function Complexity({ rows }) {
  return (
    <Paper variant="outlined" sx={{
      my: 2, borderRadius: 2, overflow: 'hidden',
      borderColor: 'rgba(0,0,0,0.12)',
      borderLeft: '3px solid #F57F17',
    }}>
      <Box sx={{ px: 2.5, py: 0.75, bgcolor: '#FFFDE7', borderBottom: '1px solid rgba(245,127,23,0.15)' }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#F57F17', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Complexity
        </Typography>
      </Box>
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#FFFEF5', display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        {rows.map(({ label, tex, note }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', minWidth: 90, flexShrink: 0 }}>
              {label}
            </Typography>
            <Box component="span" sx={{ fontSize: 14 }}>
              <Tex src={tex} />
            </Box>
            {note && (
              <Typography component="span" sx={{ fontSize: 12.5, color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
                — {note}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// ── Theorem / Lemma / Corollary / Proposition ──────────────────────────────

const THEOREM_STYLES = {
  theorem:     { bg: '#EEF2FF', border: '#3F51B5', labelColor: '#3F51B5' },
  lemma:       { bg: '#F3F4F6', border: '#6B7280', labelColor: '#374151' },
  corollary:   { bg: '#F0FDF4', border: '#16A34A', labelColor: '#15803D' },
  proposition: { bg: '#FFF7ED', border: '#EA580C', labelColor: '#C2410C' },
};

function TheoremBox({ type, n, children }) {
  const s = THEOREM_STYLES[type] || THEOREM_STYLES.theorem;
  const label = type.charAt(0).toUpperCase() + type.slice(1) + (n != null ? ` ${n}` : '') + '.';
  return (
    <Paper variant="outlined" sx={{
      my: 2, p: 2.5, borderRadius: 2,
      borderColor: s.border,
      borderLeft: `3px solid ${s.border}`,
      bgcolor: s.bg,
    }}>
      <Typography component="div" sx={{ fontSize: 14.5, lineHeight: 1.8, color: '#1d1d1f' }}>
        <Box component="span" sx={{ fontWeight: 700, fontStyle: 'italic', color: s.labelColor, mr: 0.75 }}>
          {label}
        </Box>
        {children}
      </Typography>
    </Paper>
  );
}

export function Theorem({ n, children })     { return <TheoremBox type="theorem"     n={n}>{children}</TheoremBox>; }
export function Lemma({ n, children })       { return <TheoremBox type="lemma"       n={n}>{children}</TheoremBox>; }
export function Corollary({ n, children })   { return <TheoremBox type="corollary"   n={n}>{children}</TheoremBox>; }
export function Proposition({ n, children }) { return <TheoremBox type="proposition" n={n}>{children}</TheoremBox>; }

// ── Proof sketch ───────────────────────────────────────────────────────────

export function Proof({ children }) {
  return (
    <Box sx={{ my: 1.5, pl: 2.5, borderLeft: '2px solid rgba(0,0,0,0.1)' }}>
      <Typography component="div" sx={{ fontSize: 13.5, color: 'rgba(0,0,0,0.65)', lineHeight: 1.85 }}>
        <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 600, color: 'rgba(0,0,0,0.45)', mr: 0.75 }}>
          Proof sketch.
        </Box>
        {children}
        <Box component="span" sx={{ ml: 1.5, color: 'rgba(0,0,0,0.35)', fontSize: 16, fontStyle: 'normal' }}>□</Box>
      </Typography>
    </Box>
  );
}
