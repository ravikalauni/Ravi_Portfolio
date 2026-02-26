import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Scribble {
  id: number;
  type: 'text' | 'line';
  content?: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  path?: string;
}

const WORDS = ["Ravi", "Hey", "Welcome", "BCA", "Code", "Design", "Sketch", "Idea", "Create",];

const generatePath = () => {
  const points = [];
  const startX = 0;
  const startY = 0;
  points.push(`M ${startX} ${startY}`);

  let currX = startX;
  let currY = startY;

  for (let i = 0; i < 3; i++) {
    currX += (Math.random() - 0.5) * 100;
    currY += (Math.random() - 0.5) * 100;
    const cp1x = currX + (Math.random() - 0.5) * 50;
    const cp1y = currY + (Math.random() - 0.5) * 50;
    points.push(`Q ${cp1x} ${cp1y} ${currX} ${currY}`);
  }

  return points.join(' ');
};

export const SketchBackground = () => {
  const [scribbles, setScribbles] = useState<Scribble[]>([]);

  useEffect(() => {
    const generateScribbles = () => {
      const newScribbles: Scribble[] = [];
      // Words
      for (let i = 0; i < 12; i++) {
        newScribbles.push({
          id: Math.random(),
          type: 'text',
          content: WORDS[Math.floor(Math.random() * WORDS.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotate: (Math.random() - 0.5) * 60,
          scale: 0.7 + Math.random() * 0.6,
          delay: Math.random() * 20,
        });
      }
      // Lines
      for (let i = 0; i < 20; i++) {
        newScribbles.push({
          id: Math.random(),
          type: 'line',
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotate: Math.random() * 360,
          scale: 0.5 + Math.random() * 1.5,
          delay: Math.random() * 20,
          path: generatePath(),
        });
      }
      setScribbles(newScribbles);
    };

    generateScribbles();
    const interval = setInterval(generateScribbles, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-15 dark:opacity-10">
      <svg className="w-full h-full">
        {scribbles.map((s) => (
          <motion.g
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              delay: s.delay,
              duration: 10,
              times: [0, 0.1, 0.9, 1],
              ease: "linear"
            }}
            style={{
              transform: `translate(${s.x}%, ${s.y}%) rotate(${s.rotate}deg) scale(${s.scale})`,
            }}
          >
            {s.type === 'text' ? (
              <motion.text
                x="0"
                y="0"
                className="hand-font text-5xl fill-none stroke-current stroke-[1px] text-slate-900 dark:text-slate-100"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: s.delay + 0.5,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                {s.content}
              </motion.text>
            ) : (
              <motion.path
                d={s.path}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="1, 3"
                className="text-slate-700 dark:text-slate-300"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  delay: s.delay,
                  duration: 4,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.g>
        ))}
      </svg>
    </div>
  );
};
