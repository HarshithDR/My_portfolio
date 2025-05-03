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

// Common AI/ML symbols and short equations/formulas
const symbols = [
  'σ(x) = 1 / (1 + e⁻ˣ)', // Sigmoid Function
  'ReLU(x) = max(0, x)', // ReLU Function
  'L = -Σ yᵢ log(ŷᵢ)',    // Cross-Entropy Loss (simplified)
  'MSE = Σ(yᵢ - ŷᵢ)² / n', // Mean Squared Error
  '∇L(θ)',                 // Gradient of Loss
  'θ ← θ - η∇L(θ)',       // Gradient Descent Update Rule
  'P(A|B) = P(B|A)P(A)/P(B)', // Bayes' Theorem
  'E[X] = Σ xᵢP(xᵢ)',      // Expected Value
  'Var(X) = E[(X-μ)²]',    // Variance
  'argmax f(x)',           // Argmax
  'y = Wx + b',           // Linear Equation
  'softmax(z)ᵢ = eᶻᵢ / Σ eᶻⱼ', // Softmax Function
  'Precision = TP / (TP + FP)', // Precision Formula
  'Recall = TP / (TP + FN)', // Recall Formula
  'F1 = 2 * (Prec * Rec) / (Prec + Rec)', // F1 Score
  'Euclidean Dist = √(Σ(xᵢ - yᵢ)²)', // Euclidean Distance
  'Cosine Sim = (A·B) / (||A|| ||B||)', // Cosine Similarity
  'NLP', 'CNN', 'RNN', 'LSTM', 'Transformer', 'RAG', 'LLM', 'GPT', // Acronyms still okay
  '∫ f(x) dx', 'Σ', 'Π', '∇', '∂', // Basic Math Symbols
  'α', 'β', 'λ', 'η', 'θ', 'μ', 'ω', 'σ', // Greek Letters
];


const MathSymbolBackground: React.FC<MathSymbolBackgroundProps> = ({
  className,
  symbolColor = 'hsl(var(--foreground) / 0.6)', // Use the passed color or default - INCREASED OPACITY
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
        const lengthFactor = Math.max(0.6, 1 - (this.symbol.length / 40));
        this.size = (fontSize + Math.random() * (fontSize * 0.3)) * lengthFactor;
        this.opacity = 0.3 + Math.random() * 0.3; // Increased base opacity and range
        this.rotation = Math.random() * Math.PI * 0.2 - Math.PI * 0.1;
        this.rotationSpeed = (Math.random() - 0.5) * 0.001;
        this.color = particleColor; // Store the color
      }

      update(w: number, h: number) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -this.size * 5) this.x = w + this.size * 5;
        if (this.x > w + this.size * 5) this.x = -this.size * 5;
        if (this.y < -this.size * 2) this.y = h + this.size * 2;
        if (this.y > h + this.size * 2) this.y = -this.size * 2;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rotation);

        context.globalAlpha = this.opacity;
        context.fillStyle = this.color; // Use the particle's color
        context.font = `${this.size}px 'Courier New', monospace`;
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
    // Re-run effect if symbolColor changes
  }, [symbolColor, symbolCount, speed, fontSize]);


  return (
    <div ref={containerRef} className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};

export default MathSymbolBackground;
