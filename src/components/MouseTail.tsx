import React, { useEffect, useRef, useState } from 'react';

export const MouseTail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const points = useRef<{ x: number; y: number; age: number }[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsEnabled(prev => !prev);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isEnabled) {
        points.current.push({ x: e.clientX, y: e.clientY, age: 0 });
        if (points.current.length > 8) {
          points.current.shift();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEnabled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isEnabled && points.current.length > 1) {
        // Age points
        points.current.forEach(p => p.age++);
        points.current = points.current.filter(p => p.age < 8);

        // Draw each segment
        for (let i = 1; i < points.current.length; i++) {
          const current = points.current[i];
          const prev = points.current[i - 1];

          const opacity = Math.max(0, 1 - (current.age / 8));

          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(current.x, current.y);

          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(255, 255, 255, ${opacity * 0.5})`;

          ctx.stroke();
        }

        ctx.shadowBlur = 0;
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};