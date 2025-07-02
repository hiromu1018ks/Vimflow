'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from "@/contexts/ThemeContext";
import { useSmoothMousePositionAsRef } from '@/hooks/useMousePosition';

interface FlowBackgroundProps {
  enabled?: boolean;
  intensity?: "light" | "normal" | "strong";
  className?: string;
}

export default function FlowBackground({
  enabled = true,
  intensity = "normal",
  className = ""
}: FlowBackgroundProps) {
  const { isDark } = useTheme();

  if (!enabled) return null;

  const backgroundStyle = isDark
    ? 'radial-gradient(ellipse at center, #0d1a26 0%, #000000 70%)'
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #f1f3f4 70%, #ffffff 100%)';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      style={{ background: backgroundStyle }}
      aria-hidden="true"
    >
      {isDark ? (
        <NeuralNetworkAnimation intensity={intensity} />
      ) : (
        <InteractiveOrbsAnimation intensity={intensity} />
      )}
    </div>
  );
}

// --- ダークモード：ニューラルネットワーク・コネクション --- //
const NeuralNetworkAnimation = ({ intensity }: { intensity: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useSmoothMousePositionAsRef(0.08);

  const getParticleCount = () => {
    switch (intensity) {
      case 'light': return 80;
      case 'strong': return 200;
      default: return 120;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: any[] = [];
    const particleCount = getParticleCount();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      originX: number;
      originY: number;
      velocityX: number = 0;
      velocityY: number = 0;
      wanderAngle: number;
      time: number = Math.random() * 100;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = this.x;
        this.originY = this.y;
        this.size = Math.random() * 1.5 + 0.5;
        this.wanderAngle = Math.random() * Math.PI * 2;
      }

      update(mouseX: number | null, mouseY: number | null) {
        this.time += 0.01;

        // 1. 自律的な動き (Organic Wandering)
        this.wanderAngle += (Math.random() - 0.5) * 0.1;
        const wanderForce = 0.1;
        this.velocityX += Math.cos(this.wanderAngle) * wanderForce;
        this.velocityY += Math.sin(this.wanderAngle) * wanderForce;

        // 2. マウスとのインタラクション (Attraction & Repulsion)
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const attractionDistance = 250;
          const repulsionDistance = 80;

          if (distance < repulsionDistance) {
            // 反発
            const force = (repulsionDistance - distance) / repulsionDistance;
            this.velocityX -= (dx / distance) * force * 0.8;
            this.velocityY -= (dy / distance) * force * 0.8;
          } else if (distance < attractionDistance) {
            // 引き寄せ
            const force = (distance - repulsionDistance) / (attractionDistance - repulsionDistance);
            this.velocityX += (dx / distance) * force * 0.2;
            this.velocityY += (dy / distance) * force * 0.2;
          }
        }

        // 3. 元の位置への復元力 (Return to Origin)
        const returnForce = 0.005;
        this.velocityX += (this.originX - this.x) * returnForce;
        this.velocityY += (this.originY - this.y) * returnForce;

        // 4. 摩擦と速度制限 (Friction & Speed Limit)
        this.velocityX *= 0.95;
        this.velocityY *= 0.95;

        const maxSpeed = 2;
        const speed = Math.sqrt(this.velocityX * this.velocityX + this.velocityY * this.velocityY);
        if (speed > maxSpeed) {
          this.velocityX = (this.velocityX / speed) * maxSpeed;
          this.velocityY = (this.velocityY / speed) * maxSpeed;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
      }

      draw() {
        ctx!.beginPath();
        const glow = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
        glow.addColorStop(0, 'rgba(100, 200, 255, 0.8)');
        glow.addColorStop(0.5, 'rgba(0, 150, 255, 0.3)');
        glow.addColorStop(1, 'rgba(0, 50, 150, 0)');
        
        ctx!.fillStyle = glow;
        ctx!.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connect = () => {
      const connectDistance = 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectDistance) {
            const opacity = 1 - (distance / connectDistance);
            ctx!.strokeStyle = `rgba(100, 200, 255, ${opacity * 0.5})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mousePositionRef.current;
      particles.forEach(p => {
        p.update(mouse.x, mouse.y);
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', () => {
        resizeCanvas();
        init();
      });
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};


// --- ライトモード：インタラクティブ・オーブ --- //
const InteractiveOrbsAnimation = ({ intensity }: { intensity: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useSmoothMousePositionAsRef(0.06);

  const getOrbCount = () => {
    switch (intensity) {
      case 'light': return 10;
      case 'strong': return 25;
      default: return 15;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const orbs: any[] = [];
    const orbCount = getOrbCount();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Orb {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      velocityX: number = 0;
      velocityY: number = 0;
      hue: number;
      time: number = Math.random() * 100;

      constructor() {
        const margin = 100;
        this.x = margin + Math.random() * (canvas.width - margin * 2);
        this.y = margin + Math.random() * (canvas.height - margin * 2);
        this.baseSize = Math.random() * 60 + 40;
        this.size = this.baseSize;
        this.hue = Math.random() * 60 + 200; // Hues from blue to purple
      }

      update(mouseX: number | null, mouseY: number | null) {
        this.time += 0.015;

        // 1. Mouse Interaction (Gentle Repulsion)
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const fleeDistance = 150;

          if (distance < fleeDistance) {
            const force = (fleeDistance - distance) / fleeDistance;
            this.velocityX += (dx / distance) * force * 0.5;
            this.velocityY += (dy / distance) * force * 0.5;
          }
        }

        // 2. Gentle Wandering
        const wanderSpeed = 0.1;
        this.velocityX += (Math.random() - 0.5) * wanderSpeed;
        this.velocityY += (Math.random() - 0.5) * wanderSpeed;
        
        // 3. Flow Field
        const flowStrength = 0.05;
        this.velocityX += Math.sin(this.y / 100 + this.time) * flowStrength;
        this.velocityY += Math.cos(this.x / 100 + this.time) * flowStrength;


        // 4. Friction & Speed Limit
        this.velocityX *= 0.96;
        this.velocityY *= 0.96;
        
        const maxSpeed = 1.5;
        const speed = Math.sqrt(this.velocityX*this.velocityX + this.velocityY*this.velocityY);
        if (speed > maxSpeed) {
            this.velocityX = (this.velocityX / speed) * maxSpeed;
            this.velocityY = (this.velocityY / speed) * maxSpeed;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;

        // 5. Screen Boundaries (Soft Bounce)
        const margin = this.size;
        if (this.x < margin) { this.x = margin; this.velocityX *= -0.5; }
        if (this.x > canvas.width - margin) { this.x = canvas.width - margin; this.velocityX *= -0.5; }
        if (this.y < margin) { this.y = margin; this.velocityY *= -0.5; }
        if (this.y > canvas.height - margin) { this.y = canvas.height - margin; this.velocityY *= -0.5; }
      }

      draw() {
        ctx!.save();
        ctx!.globalCompositeOperation = 'lighter';

        const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue}, 90%, 80%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 85%, 70%, 0.4)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);

        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        
        ctx!.restore();
      }
    }

    const init = () => {
      orbs.length = 0;
      for (let i = 0; i < orbCount; i++) {
        orbs.push(new Orb());
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mousePositionRef.current;
      orbs.forEach(o => {
        o.update(mouse.x, mouse.y);
        o.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    init();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', () => {
        resizeCanvas();
        init();
      });
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};
