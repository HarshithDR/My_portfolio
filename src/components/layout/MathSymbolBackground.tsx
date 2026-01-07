// src/components/layout/MathSymbolBackground.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MathSymbolBackgroundProps {
  className?: string;
  symbolColor?: string; // Make color a prop
  symbolCount?: number;
  speed?: number;
  fontSize?: number;
}

// Expanded list with a heavy focus on Robotics, Control Systems, and advanced AI/ML for robotics
const symbols = [
  // Core Robotics & Kinematics
  'T = A₁ * A₂ * ... * Aₙ', // Forward Kinematics
  'q = f⁻¹(T)',             // Inverse Kinematics
  'J(q)',                   // Jacobian Matrix
  'ẋ = J(q)ġ',              // Velocity Kinematics
  'τ = Jᵀ(q)F',             // Static Force Relationship
  'M(q)q̈ + C(q, ġ)ġ + g(q) = τ', // Robot Dynamics
  'R_z(θ)',                 // Rotation Matrix
  'MPC', 'RRT*', 'PID', 'SLAM',
  
  // ASCII Art representations
  '[(-)]--/--O',          // Simple Manipulator Arm
  'o-<-<',                  // Another arm style
  'O===[,,,]',              // Gripper
  '//o\\\\',                 // Humanoid-like structure
  'Δx_k = x_k - ẋ_k',

  // Control Systems & State Estimation
  'u(t) = Kp*e(t) + Ki∫e(t)dt + Kd*de/dt', // PID Controller
  'ẋ = Ax + Bu',            // State-Space Representation
  'y = Cx + Du',
  'P(x, m | z, u)',         // SLAM Posterior
  'x̂ₖ = A*x̂ₖ₋₁ + B*uₖ',     // Kalman Filter Prediction
  'K = P*Hᵀ(H*P*Hᵀ+R)⁻¹',  // Kalman Gain
  'P(A|B) = P(B|A)P(A)/P(B)', // Bayes' Theorem

  // Advanced AI/ML for Robotics
  'Attention(Q, K, V) = softmax(QKᵀ/√dₖ)V', // Transformer Attention
  '∇L(θ)',                 // Gradient of Loss
  'θ ← θ - η∇L(θ)',       // Gradient Descent Update Rule
  'GAN: minₒ maxₔ V(D, G)', // GAN Objective
  'Dₖₗ(P||Q)',             // KL Divergence
  'H(X) = -Σ P(x) log P(x)', // Entropy
  'σ(x)', 'ReLU(x)',
  
  // General Math & Greek Letters
  '∫ f(x) dx', 'Σ', 'Π', '∇', '∂',
  'α', 'β', 'λ', 'η', 'θ', 'μ', 'ω', 'σ', 'ε', 'τ', 'q', 'ẋ',
  'argmax f(x)',
];


const MathSymbolBackground: React.FC<MathSymbolBackgroundProps> = ({
  className,
  symbolColor = 'hsl(var(--foreground) / 0.6)', // Use the passed color or default - Increased opacity
  symbolCount = 30,
  speed = 0.5,
  fontSize = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      symbol: string;
      size: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      color: string; // Added color property

      constructor(w: number, h: number, particleColor: string) { // Accept color
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        // Adjust size based on symbol length to make longer equations slightly smaller
        const lengthFactor = Math.max(0.5, 1 - (this.symbol.length / 50)); // Adjust divisor as needed
        this.size = (fontSize + Math.random() * (fontSize * 0.3)) * lengthFactor; // Use passed fontSize
        this.opacity = 0.4 + Math.random() * 0.3; // Make them slightly more opaque
        this.rotation = Math.random() * Math.PI * 0.1 - Math.PI * 0.05; // Reduce rotation range
        this.rotationSpeed = (Math.random() - 0.5) * 0.0005; // Slow down rotation
        this.color = particleColor; // Store the color
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Adjust boundaries based on estimated max symbol width/height
        const estimatedWidth = this.size * (this.symbol.length * 0.6); // Rough estimate
        const estimatedHeight = this.size;

        if (this.x < -estimatedWidth) this.x = w + estimatedWidth;
        if (this.x > w + estimatedWidth) this.x = -estimatedWidth;
        if (this.y < -estimatedHeight) this.y = h + estimatedHeight;
        if (this.y > h + estimatedHeight) this.y = -estimatedHeight;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);

        context.globalAlpha = this.opacity;
        context.fillStyle = this.color; // Use the particle's color
        context.font = `${this.size}px 'Courier New', monospace`; // Consistent monospace font
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.symbol, 0, 0);

        context.restore();
        context.globalAlpha = 1.0;
      }
    }

    const initializeParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < symbolCount; i++) {
        // Pass the symbolColor prop to the Particle constructor
        particlesRef.current.push(new Particle(width, height, symbolColor));
      }
    };

    const resizeCanvas = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initializeParticles();
    };

    const draw = () => {
      if (!ctx || !width || !height) return;

       ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach(particle => {
        particle.update(width, height);
        particle.draw(ctx);
      });

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    animationFrameIdRef.current = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
    // Re-run effect if symbolColor, count, speed, or fontSize changes
  }, [symbolColor, symbolCount, speed, fontSize]);


  return (
    <div ref={containerRef} className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default MathSymbolBackground;
