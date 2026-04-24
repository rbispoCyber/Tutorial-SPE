import { useEffect, useRef } from 'react';

function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function SphereBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    let raf: number;
    let animT = 0;

    /* ── Timings ── */
    const INTRO_DURATION = 1.5;
    const startTime = performance.now();

    /* ── Particles (Lozenges Constellation) ── */
    interface Particle { x: number; y: number; vx: number; vy: number; size: number; }
    const numParticles = 60;
    const particles: Particle[] = [];
    // Espalha pelas bordas aleatoriamente
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() > 0.5 ? Math.random() * 250 : window.innerWidth - Math.random() * 250,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 4 + 3,
      });
    }

    /* ── Mouse ── */
    const mouse  = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.20 };
    const smooth = { x: mouse.x, y: mouse.y };
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMouse, { passive: true });

    /* ── Scroll ── */
    let scrollY     = window.scrollY;
    let scrollSmooth = scrollY;
    const onScroll  = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Resize ── */
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    /* ══════════════════════ DRAW ══════════════════════ */
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Intro scale */
      const elapsed     = (performance.now() - startTime) / 1000;
      const introScale  = easeOutExpo(Math.min(elapsed / INTRO_DURATION, 1));
      const fadeIn      = Math.min(elapsed / 0.7, 1);

      /* Lerp mouse & scroll */
      smooth.x     += (mouse.x  - smooth.x)     * 0.055;
      smooth.y     += (mouse.y  - smooth.y)     * 0.055;
      scrollSmooth += (scrollY  - scrollSmooth) * 0.08;

      /* ── Sphere geometry ──
         Sphere is FIXED on screen (position: fixed canvas) but its
         vertical centre shifts ~30% of scroll so it appears to "float"
         behind the content as you scroll.                                */
      const cx   = W / 2;
      const cyBase = H * 0.40;                          // resting centre
      const cyOffset = scrollSmooth * 0.28;             // parallax factor
      const cy   = cyBase + cyOffset;

      /* Radius: slightly LARGER than the accordion card (≈ 680px wide)
         We target ~55% of the viewport shorter dimension.               */
      const Rfull = Math.min(W, H) * 0.56;
      const R     = Rfull * introScale;

      if (R < 2) { animT += 0.016; raf = requestAnimationFrame(draw); return; }

      /* Direction from sphere centre → smoothed mouse cursor */
      const dx    = smooth.x - cx;
      const dy    = smooth.y - cy;
      const len   = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx    = dx / len;
      const ny    = dy / len;
      const angle = Math.atan2(dy, dx);
      const dist  = Math.min(len / (Math.max(W, H) * 0.50), 1);

      ctx.globalAlpha = fadeIn;

      /* ── 1. Ambient atmosphere behind sphere ── */
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.45, cx, cy, R * 1.75);
      atmo.addColorStop(0,   'rgba(0, 42, 122,0.12)');
      atmo.addColorStop(0.6, 'rgba(0, 42, 122,0.05)');
      atmo.addColorStop(1,   'rgba(244,247,251,0)');
      ctx.fillStyle = atmo;
      ctx.fillRect(0, 0, W, H);

      /* ── 1.5 Interconnected Lozenges (Constellation) ── */
      const connectDist = 140;
      const mouseDist = 200;
      // Aparece do vazio em 1.0s apenas após a página começar
      const particleFade = Math.max(0, Math.min((elapsed - 1.0) / 1.0, 1));

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Limites da tela (rebate)
        if (p.x < 0) { p.x = 0; p.vx *= -1.1; }
        if (p.x > W) { p.x = W; p.vx *= -1.1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1.1; }
        if (p.y > H) { p.y = H; p.vy *= -1.1; }

        // Interação 1: Repulsão da esfera azul (evita que entrem no meio)
        const dxS = p.x - cx;
        const dyS = p.y - cy;
        const distS = Math.sqrt(dxS * dxS + dyS * dyS) || 1;
        const sphereRepelR = R + 10; 
        if (distS < sphereRepelR) {
          const force = (sphereRepelR - distS) * 0.03;
          p.vx += (dxS / distS) * force;
          p.vy += (dyS / distS) * force;
        }

        // Interação 2: Cursor do mouse
        const dxM = p.x - smooth.x;
        const dyM = p.y - smooth.y;
        const distM = Math.sqrt(dxM * dxM + dyM * dyM) || 1;
        if (distM < mouseDist) {
          // Atração sutil criando um campo interativo
          const force = (mouseDist - distM) * 0.0003;
          p.vx -= (dxM / distM) * force; 
          p.vy -= (dyM / distM) * force;
        }

        // Atrito e limite de velocidade para uma animação fluida
        p.vx *= 0.98;
        p.vy *= 0.98;
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 3) {
          p.vx = (p.vx / spd) * 3;
          p.vy = (p.vy / spd) * 3;
        } else if (spd < 0.2) {
          p.vx += (Math.random() - 0.5) * 0.15;
          p.vy += (Math.random() - 0.5) * 0.15;
        }

        // Renderizar linhas e formas apenas quando o fade estiver ativo
        if (particleFade > 0) {
          ctx.globalAlpha = fadeIn * particleFade;
          
          // Desenhar linhas conectando com partículas próximas
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const ddx = p.x - p2.x;
            const ddy = p.y - p2.y;
            const d = Math.sqrt(ddx * ddx + ddy * ddy);
            if (d < connectDist) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(0, 42, 122, ${0.28 * (1 - d / connectDist)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
          
          // Linhas interativas conectando a partícula ao mouse
          if (distM < mouseDist) {
             ctx.beginPath();
             ctx.moveTo(p.x, p.y);
             ctx.lineTo(smooth.x, smooth.y);
             ctx.strokeStyle = `rgba(0, 42, 122, ${0.32 * (1 - distM / mouseDist)})`;
             ctx.lineWidth = 1;
             ctx.stroke();
          }

          // Renderizar a partícula no formato de lozango
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = `rgba(0, 42, 122, 0.40)`;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.fillStyle = `rgba(0, 61, 165, 0.95)`;
          ctx.fillRect(-p.size / 4, -p.size / 4, p.size / 2, p.size / 2);
          ctx.restore();
          
          // Retornar a alpha mestre
          ctx.globalAlpha = fadeIn;
        }
      }

      /* ── 2. Sphere body ── */
      const hx = cx + nx * R * 0.20;
      const hy = cy + ny * R * 0.20;
      const body = ctx.createRadialGradient(hx, hy, 0, cx, cy, R);
      body.addColorStop(0,    'rgba(60, 140, 220, 0.85)');   // Central highlight
      body.addColorStop(0.30, 'rgba(0, 61, 165, 0.90)');     // Official SPE blue covers the upper center
      body.addColorStop(0.65, 'rgba(0, 25, 75, 0.95)');      // Deep navy for the volume
      body.addColorStop(1,    'rgba(0, 10, 35, 0.98)');      // Almost black midnight blue at the rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.restore();

      /* ── 3. Inner depth vignette ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      const inner = ctx.createRadialGradient(cx, cy, R * 0.40, cx, cy, R);
      inner.addColorStop(0, 'rgba(0,0,0,0)');
      inner.addColorStop(0.7, 'rgba(0, 25, 75, 0.35)'); // Deeper inner shadow
      inner.addColorStop(1, 'rgba(0, 5, 20, 0.70)');    // Very dark shadow directly on edge to make the rim light pop
      ctx.fillStyle = inner;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      /* ── 4. Rim light: crescent arc along sphere curvature ───────────── */
      const rimI   = 1.0;                     // Always full intensity — no falloff
      const arcCtr = angle;                   
      const HALF   = Math.PI * 0.35;          // Arc span ~±63° — wider glow

      // Layer 1 — wide diffuse glow (Pure White)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R + 6, arcCtr - HALF, arcCtr + HALF);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.20)`;
      ctx.lineWidth   = 32;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();

      // Layer 2 — tighter inner glow
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R + 2, arcCtr - HALF * 0.80, arcCtr + HALF * 0.80);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.40)`;
      ctx.lineWidth   = 18;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();

      // Layer 3 — bright solid rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, arcCtr - HALF * 0.60, arcCtr + HALF * 0.60);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.70)`;
      ctx.lineWidth   = 8;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();

      // Layer 4 — intense hot band
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, arcCtr - HALF * 0.35, arcCtr + HALF * 0.35);
      ctx.strokeStyle = `rgba(255, 255, 255, 0.90)`;
      ctx.lineWidth   = 4;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();

      // Layer 5 — razor-sharp white core
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, arcCtr - HALF * 0.15, arcCtr + HALF * 0.15);
      ctx.strokeStyle = `rgba(255, 255, 255, 1.0)`;
      ctx.lineWidth   = 1.5;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();

      // Layer 6 — burning specular tip
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, arcCtr - HALF * 0.05, arcCtr + HALF * 0.05);
      ctx.strokeStyle = `rgba(255, 255, 255, 1.0)`;
      ctx.lineWidth   = 0.5;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();

      /* ── 4.5 Core Specular dot (Primary reflection facing cursor) ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      const coreHole = ctx.createRadialGradient(hx, hy, 0, hx, hy, R * 0.35);
      coreHole.addColorStop(0,   `rgba(255,255,255,${0.50 * rimI})`);
      coreHole.addColorStop(0.15,`rgba(200,230,255,${0.15 * rimI})`);
      coreHole.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = coreHole;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      /* ── 5. Bounce light (opposite side, subtle cyan fill for 3D realism) ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();
      const oppX = cx - nx * R * 0.55;
      const oppY = cy - ny * R * 0.55;
      const spec = ctx.createRadialGradient(oppX, oppY, 0, oppX, oppY, R * 0.60);
      spec.addColorStop(0,   `rgba(0, 180, 255, ${0.15 * rimI})`); // Cyan bounce light!
      spec.addColorStop(0.5, `rgba(0, 80, 200, ${0.06 * rimI})`);
      spec.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = spec;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      /* ── 6. Equator / horizon line ── */
      const pulse = 0.78 + 0.22 * Math.sin(animT * 0.9);
      const lineY = cy + R * 0.01;

      // Wide bloom behind horizon
      const bloom = ctx.createRadialGradient(cx, lineY, 0, cx, lineY, W * 0.46);
      bloom.addColorStop(0,   `rgba(0, 42, 122,${0.15 * pulse})`);
      bloom.addColorStop(0.3, `rgba(0, 42, 122,${0.07 * pulse})`);
      bloom.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, lineY - H * 0.22, W, H * 0.44);

      // Crisp equator line clipped inside sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 1, 0, Math.PI * 2);
      ctx.clip();
      const hLine = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      hLine.addColorStop(0,   'rgba(255,255,255,0)');
      hLine.addColorStop(0.28, `rgba(255,255,255,${0.65 * pulse})`);
      hLine.addColorStop(0.50, `rgba(255,255,255,${0.92 * pulse})`);
      hLine.addColorStop(0.72, `rgba(255,255,255,${0.65 * pulse})`);
      hLine.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = hLine;

      // Sub-line (fainter, slightly below like a glass rail)
      ctx.globalAlpha = 0.35;
      ctx.fillRect(0, lineY + 6, W, 1);
      ctx.globalAlpha = 1.0;
      
      // Main line
      ctx.fillRect(0, lineY - 1, W, 1.5);
      ctx.restore();

      /* ── 7. Sphere border ring ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.20)'; // Glowing cyan crystal edge
      ctx.lineWidth   = 1;
      ctx.stroke();
      ctx.restore();

      ctx.globalAlpha = 1;
      animT += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('resize',    resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}
