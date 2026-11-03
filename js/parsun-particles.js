/**
 * PARSUN.COM 3D PARTICLE TEXTURE ENGINE
 * Fixed 3D Particle Network Constellation & Global Topology
 * Responsive, 60/120 FPS, Camera Inertia & Scroll Reactivity
 */

(function () {
  'use strict';

  // Respect user prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  class Parsun3DParticleNetwork {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      // 3D Camera / World Rotation
      this.rotX = 0.25;
      this.rotY = 0.1;
      this.targetRotX = 0.25;
      this.targetRotY = 0.1;
      this.autoSpinY = 0.0018;
      this.autoSpinX = 0.0006;

      // Scroll reactive translation
      this.scrollY = window.scrollY || 0;
      this.targetScrollY = this.scrollY;

      // Particle system parameters
      this.isMobile = window.innerWidth < 768;
      this.particleCount = this.isMobile ? 150 : 320;
      this.connectionDistance = this.isMobile ? 65 : 85;
      this.radius = Math.min(this.width, this.height) * (this.isMobile ? 0.38 : 0.44);
      this.particles = [];
      this.bursts = [];

      this.initParticles();
      this.bindEvents();
      this.resize();
      this.animate();
    }

    initParticles() {
      this.particles = [];
      const goldenRatio = (1 + Math.sqrt(5)) / 2;

      for (let i = 0; i < this.particleCount; i++) {
        // Fibonacci sphere distribution for uniform 3D spherical coverage
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / this.particleCount);

        // Natural depth variance for organic 3D cloud
        const r = this.radius * (0.75 + Math.random() * 0.45);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        // Parsun Color Palette: Electric Blue (#0070F3) and Aqua Cyan (#00DFD8)
        const isCyan = Math.random() > 0.62;
        const color = isCyan ? 'rgba(0, 223, 216, ' : 'rgba(0, 112, 243, ';

        this.particles.push({
          x: x,
          y: y,
          z: z,
          baseR: 1.4 + Math.random() * 1.8,
          color: color,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03
        });
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.isMobile = this.width < 768;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      this.radius = Math.min(this.width, this.height) * (this.isMobile ? 0.38 : 0.44);
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.initParticles();
      }, { passive: true });

      // Cursor movement tilts 3D camera
      window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / this.width) * 2 - 1;
        const normY = (e.clientY / this.height) * 2 - 1;
        this.targetRotY = normX * 0.45;
        this.targetRotX = -normY * 0.35;
      }, { passive: true });

      // Scroll reactive rotation
      window.addEventListener('scroll', () => {
        this.targetScrollY = window.scrollY || 0;
      }, { passive: true });

      // Interactive click / touch burst wave
      window.addEventListener('click', (e) => {
        this.bursts.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: 180,
          opacity: 0.8
        });
      });
    }

    project(x, y, z) {
      // 3D Perspective Projection
      const fov = 680;
      const zoom = fov / (fov + z + 420);

      // Centered position (with subtle right offset on desktop like Parsun)
      const offsetX = this.width > 900 ? this.width * 0.65 : this.width * 0.5;
      const offsetY = this.height * 0.48 - (this.scrollY * 0.12);

      return {
        x: offsetX + x * zoom,
        y: offsetY + y * zoom,
        z: z,
        scale: zoom
      };
    }

    animate() {
      if (document.hidden) {
        requestAnimationFrame(() => this.animate());
        return;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      // Smooth camera interpolation
      this.rotX += (this.targetRotX - this.rotX) * 0.05 + this.autoSpinX;
      this.rotY += (this.targetRotY - this.rotY) * 0.05 + this.autoSpinY;
      this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;

      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);
      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);

      // Draw click shockwaves
      for (let b = this.bursts.length - 1; b >= 0; b--) {
        const burst = this.bursts[b];
        burst.radius += 4;
        burst.opacity -= 0.02;

        this.ctx.beginPath();
        this.ctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(0, 223, 216, ${Math.max(0, burst.opacity)})`;
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();

        if (burst.opacity <= 0) {
          this.bursts.splice(b, 1);
        }
      }

      // 3D Rotate and Project Particles
      const projected = [];
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // 3D Rotation around Y axis
        let x1 = p.x * cosY + p.z * sinY;
        let z1 = -p.x * sinY + p.z * cosY;

        // 3D Rotation around X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        const proj = this.project(x1, y2, z2);
        p.pulse += p.pulseSpeed;

        projected.push({
          x: proj.x,
          y: proj.y,
          z: proj.z,
          scale: proj.scale,
          color: p.color,
          radius: p.baseR * proj.scale * (1 + Math.sin(p.pulse) * 0.22)
        });
      }

      // Draw 3D Connection Lines between nearby points
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.connectionDistance) {
            const alpha = (1 - dist / this.connectionDistance) * 0.22 * Math.min(p1.scale, p2.scale);
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(0, 112, 243, ${alpha})`;
            this.ctx.lineWidth = 0.8;
            this.ctx.stroke();
          }
        }
      }

      // Draw Glowing Particle Nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(Math.max((p.z + 300) / 600, 0.15), 0.95);

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
        this.ctx.fillStyle = p.color + alpha + ')';
        this.ctx.shadowColor = '#0070F3';
        this.ctx.shadowBlur = 6 * p.scale;
        this.ctx.fill();
      }

      this.ctx.shadowBlur = 0;

      requestAnimationFrame(() => this.animate());
    }
  }

  function init() {
    new Parsun3DParticleNetwork('particles-canvas');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
