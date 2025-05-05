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

// Common AI/ML symbols and short equations/formulas - Expanded with more complex examples
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
  'α', 'β', 'λ', 'η', 'θ', 'μ', 'ω', 'σ', 'ε', // Greek Letters
  'Attention(Q, K, V) = softmax(QKᵀ/√dₖ)V', // Transformer Attention
  'Dₖₗ(P||Q) = Σ P(x) log(P(x)/Q(x))', // KL Divergence
  'H(X) = -Σ P(x) log P(x)',           // Entropy
  'IG(D, a) = H(D) - Σ |Dᵥ|/|D| * H(Dᵥ)', // Information Gain
  'Gini(D) = 1 - Σ pᵢ²',             // Gini Impurity
  'Adam: θ ← θ - η * m̂ / (√v̂ + ε)',  // Adam Optimizer (simplified)
  'hₜ = tanh(Wₓₓxₜ + W<0xE2><0x82><0x95>ₕhₜ₋₁ + b<0xE2><0x82><0x95>)', // RNN Hidden State
  'fₜ = σ(W<0xE2><0x82><0x91>[hₜ₋₁, xₜ] + b<0xE2><0x82><0x91>)',   // LSTM Forget Gate
  'N(x|μ, σ²) = 1/√(2πσ²) * e^(-(x-μ)²/(2σ²))', // Gaussian PDF
  'P(C|X) ∝ P(C) Π P(xᵢ|C)',           // Naive Bayes Classifier
  'SVM: min ||w||² + C Σ ξᵢ',          // SVM Objective (simplified)
  'PCA: Find PCs maximizing variance',    // PCA Concept
  'GAN: min<0xE2><0x82><0x9A> max<0xE2><0x82><0x8D> V(D, G)',           // GAN Objective (conceptual)
  'Word2Vec Skip-gram: Σ log P(w<0xE1><0xB5><0xA6>₊ⱼ|w<0xE1><0xB5><0xA6>)', // Skip-gram Objective (simplified)
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

