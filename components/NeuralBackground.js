"use client";

import { useEffect, useRef } from 'react';

const NODE_COUNT = 70;
const MAX_DIST    = 170;
const SPEED       = 0.28;

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resize();

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.8 + 1.2,
    }));

    function draw() {
      const { width, height } = canvas;

      /* deep navy → dark teal gradient */
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#060d1f');
      grad.addColorStop(0.5, '#0a2a2a');
      grad.addColorStop(1, '#002d26');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      /* update positions */
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width)  n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      /* connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 210, 170, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      /* nodes — two-layer glow */
      for (const n of nodes) {
        /* outer glow */
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
        glow.addColorStop(0, 'rgba(0, 210, 170, 0.25)');
        glow.addColorStop(1, 'rgba(0, 210, 170, 0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        /* solid core */
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 230, 185, 0.85)';
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
