import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  age: number;
}

export const CursorTrail = ({ showTrail = true }: { showTrail?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    if (!showTrail) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
      pointsRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update points
      pointsRef.current = pointsRef.current
        .map(p => ({ ...p, age: p.age + 1 }))
        .filter(p => p.age < 30);

      if (pointsRef.current.length > 1) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw the "glowing" core
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';

        for (let i = 0; i < pointsRef.current.length; i++) {
          const p = pointsRef.current[i];
          const opacity = 1 - p.age / 30;
          ctx.globalAlpha = opacity;
          
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Add slight curve for more organic feel
            const prev = pointsRef.current[i - 1];
            const xc = (prev.x + p.x) / 2;
            const yc = (prev.y + p.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, xc, yc);
          }
        }
        ctx.stroke();

        // Draw secondary "sketch" lines
        ctx.shadowBlur = 0; // No glow for secondary lines
        for (let j = 0; j < 2; j++) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.5;
          
          for (let i = 0; i < pointsRef.current.length; i++) {
            const p = pointsRef.current[i];
            const opacity = (1 - p.age / 30) * 0.5;
            ctx.globalAlpha = opacity;
            
            const offsetX = (Math.random() - 0.5) * 4;
            const offsetY = (Math.random() - 0.5) * 4;

            if (i === 0) {
              ctx.moveTo(p.x + offsetX, p.y + offsetY);
            } else {
              ctx.lineTo(p.x + offsetX, p.y + offsetY);
            }
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showTrail]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'luminosity' }}
    />
  );
};
