"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Collapse, IconButton, Button, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import StorageIcon from '@mui/icons-material/Storage';
import ScienceIcon from '@mui/icons-material/Science';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { DOCS_NAV, DOCS_FLAT } from '@components/docs/nav';

const DRAWER_WIDTH = 252;
const MINI_WIDTH = 52;

const NAV_LINK = {
  fontSize: 13, fontWeight: 500,
  color: 'rgba(44,44,44,0.8)',
  textDecoration: 'none',
  mx: 1.5,
  '&:hover': { color: '#000' },
};

const GROUP_ICONS = {
  algorithms: <AccountTreeIcon fontSize="small" />,
  formats:    <InsertDriveFileIcon fontSize="small" />,
};

function normalize(href) {
  return href.endsWith('/') ? href : href + '/';
}

export default function DocsLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen]     = useState(true);
  const [expanded, setExpanded] = useState(
    () => new Set(DOCS_NAV.filter(n => n.group).map(n => n.id)),
  );

  function toggleGroup(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function isActive(href) {
    const norm = normalize(href);
    const cur  = normalize(pathname);
    if (norm === '/docs/') return cur === '/docs/';
    return cur.startsWith(norm);
  }

  // Prev / Next
  const cur = normalize(pathname);
  const idx  = DOCS_FLAT.findIndex(p => normalize(p.href) === cur);
  const prev = idx > 0                     ? DOCS_FLAT[idx - 1] : null;
  const next = idx >= 0 && idx < DOCS_FLAT.length - 1 ? DOCS_FLAT[idx + 1] : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>

      {/* AppBar */}
      <AppBar position="fixed" elevation={0} sx={{
        bgcolor: 'rgba(255,255,255,0.72)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        color: 'rgba(0,0,0,0.8)',
        zIndex: theme => theme.zIndex.drawer + 1,
        backgroundImage: 'none',
      }}>
        <Toolbar variant="dense" sx={{ minHeight: '44px !important', px: { xs: 1, sm: 2 } }}>
          <IconButton onClick={() => setOpen(o => !o)} size="small" edge="start"
            sx={{ mr: 1, color: 'rgba(44,44,44,0.65)' }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, textDecoration: 'none', mr: 2 }}>
            <ScienceIcon sx={{ fontSize: 17, color: '#1565C0' }} />
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.01em' }}>
              MachineLearning.js
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            {[
              { label: 'Home',     href: '/' },
              { label: 'Explorer', href: '/explorer/' },
              { label: 'About',    href: '/about/' },
            ].map(({ label, href }) => (
              <Box key={label} component={Link} href={href} sx={NAV_LINK}>{label}</Box>
            ))}
            <Box component="a" href="https://github.com/marink/machinelearning"
              target="_blank" rel="noreferrer"
              sx={{ ...NAV_LINK, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <GitHubIcon sx={{ fontSize: 15 }} /> GitHub
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, mt: '44px' }}>

        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: open ? DRAWER_WIDTH : MINI_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: open ? DRAWER_WIDTH : MINI_WIDTH,
              overflowX: 'hidden',
              transition: 'width 0.2s',
              mt: '44px',
              borderRight: '1px solid rgba(0,0,0,0.07)',
              bgcolor: '#FAFAFA',
              overflowY: 'auto',
            },
          }}
        >
          <List dense disablePadding sx={{ pt: 1.5, pb: 6 }}>
            {DOCS_NAV.map(item => {
              if (item.group) {
                const isExp = expanded.has(item.id);
                return (
                  <Box key={item.id}>
                    <ListItemButton
                      onClick={() => toggleGroup(item.id)}
                      sx={{ py: 0.6, px: open ? 1.5 : 1, mx: 0.5, borderRadius: 1, minHeight: 34 }}
                    >
                      <ListItemIcon sx={{ minWidth: 30, color: '#1565C0' }}>
                        {GROUP_ICONS[item.id]}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText
                            primary={item.label}
                            slotProps={{ primary: { sx: {
                              fontSize: 10, fontWeight: 700,
                              color: 'rgba(0,0,0,0.38)',
                              letterSpacing: '0.07em',
                              textTransform: 'uppercase',
                            }}}}
                          />
                          {isExp
                            ? <ExpandMoreIcon sx={{ fontSize: 16, color: 'rgba(0,0,0,0.28)' }} />
                            : <ChevronRightIcon sx={{ fontSize: 16, color: 'rgba(0,0,0,0.28)' }} />}
                        </>
                      )}
                    </ListItemButton>

                    <Collapse in={isExp && open} timeout="auto" unmountOnExit>
                      {item.children.map(child => {
                        const active = isActive(child.href);
                        return (
                          <ListItemButton
                            key={child.id}
                            component={Link}
                            href={child.href}
                            selected={active}
                            sx={{
                              py: 0.55, pl: 3.5, pr: 1.5, mx: 0.5, borderRadius: 1,
                              '&.Mui-selected':       { bgcolor: 'rgba(21,101,192,0.08)' },
                              '&.Mui-selected:hover': { bgcolor: 'rgba(21,101,192,0.12)' },
                            }}
                          >
                            <ListItemText
                              primary={child.label}
                              slotProps={{ primary: { sx: {
                                fontSize: 13,
                                fontWeight: active ? 600 : 400,
                                color: active ? '#1565C0' : '#1d1d1f',
                              }}}}
                            />
                          </ListItemButton>
                        );
                      })}
                    </Collapse>
                  </Box>
                );
              }

              // Top-level leaf (Overview, Datasets)
              const active = isActive(item.href);
              const Icon = item.id === 'overview' ? InfoIcon : StorageIcon;
              return (
                <ListItemButton
                  key={item.id}
                  component={Link}
                  href={item.href}
                  selected={active}
                  sx={{
                    py: 0.6, px: open ? 1.5 : 1, mx: 0.5, borderRadius: 1, minHeight: 34,
                    '&.Mui-selected':       { bgcolor: 'rgba(21,101,192,0.08)' },
                    '&.Mui-selected:hover': { bgcolor: 'rgba(21,101,192,0.12)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, color: active ? '#1565C0' : 'rgba(0,0,0,0.38)' }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { sx: {
                        fontSize: 13,
                        fontWeight: active ? 600 : 400,
                        color: active ? '#1565C0' : '#1d1d1f',
                      }}}}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Drawer>

        {/* Content area */}
        <Box sx={{
          flex: 1,
          minWidth: 0,
          ml: `${open ? DRAWER_WIDTH : MINI_WIDTH}px`,
          transition: 'margin-left 0.2s',
          display: 'flex',
          flexDirection: 'column',
        }}>

          <Box sx={{ flex: 1 }}>{children}</Box>

          {/* Prev / Next */}
          {(prev || next) && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: { xs: 3, md: 6 },
              py: 3.5,
              borderTop: '1px solid rgba(0,0,0,0.08)',
            }}>
              {prev ? (
                <Button component={Link} href={prev.href} startIcon={<ArrowBackIcon />}
                  sx={{ textTransform: 'none', color: '#1565C0', fontSize: 14 }}>
                  {prev.label}
                </Button>
              ) : <Box />}
              {next && (
                <Button component={Link} href={next.href} endIcon={<ArrowForwardIcon />}
                  sx={{ textTransform: 'none', color: '#1565C0', fontSize: 14 }}>
                  {next.label}
                </Button>
              )}
            </Box>
          )}

          {/* Footer */}
          <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.07)', bgcolor: '#F5F5F7' }}>
            <Typography sx={{ fontSize: 12, color: 'rgba(0,0,0,0.4)' }}>
              machinelearning.js.org · open source · MIT ·{' '}
              <a href="https://marin.kokona.website" target="_blank" rel="noreferrer"
                style={{ color: 'rgba(0,0,0,0.4)', textDecoration: 'underline' }}>
                marin.kokona.website
              </a>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
