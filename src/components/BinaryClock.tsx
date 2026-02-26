import { motion } from "motion/react";
import { useEffect, useState } from "react";

export const BinaryClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const binaryNumbers = [
    "1100", "0001", "0010", "0011", "0100", "0101",
    "0110", "0111", "1000", "1001", "1010", "1011"
  ];

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  // A wobbly hand-drawn circle path
  const wobblyPath = "M50,5 C70,6 92,20 95,50 C98,80 75,94 50,95 C25,96 4,80 5,50 C6,20 30,4 50,5";

  return (
    <div className="relative w-96 h-96 md:w-[450px] md:h-[450px] binary-clock-container">
      {/* Hand-drawn Outer Circle */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          d={wobblyPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          className="text-slate-400 dark:text-slate-600"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        {/* Second wobbly line for "sketched" effect */}
        <motion.path
          d="M50,7 C72,8 90,22 93,50 C96,78 73,92 50,93 C27,94 6,78 7,50 C8,22 28,6 50,7"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeLinecap="round"
          className="text-slate-300 dark:text-slate-700"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>

      {/* Clock Hands - using divs instead of SVG elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Hour Hand */}
        <motion.div
          className="absolute w-2 h-20 bg-slate-700 dark:bg-slate-300 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center'
          }}
          animate={{ rotate: hourAngle }}
          transition={{ type: "spring", stiffness: 50 }}
        />

        {/* Minute Hand */}
        <motion.div
          className="absolute w-1.5 h-24 bg-slate-600 dark:bg-slate-400 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center'
          }}
          animate={{ rotate: minuteAngle }}
          transition={{ type: "spring", stiffness: 50 }}
        />

        {/* Second Hand */}
        <motion.div
          className="absolute w-1 h-28 bg-slate-400 dark:bg-slate-500 rounded-full origin-bottom"
          style={{
            bottom: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            transformOrigin: 'bottom center'
          }}
          animate={{ rotate: secondAngle }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        />
      </div>

      {/* Binary Numbers */}
      {binaryNumbers.map((num, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const radius = 38;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;

        return (
          <div
            key={num}
            className="absolute hand-font text-sm md:text-base font-bold text-slate-600 dark:text-slate-400"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {num}
          </div>
        );
      })}

      {/* Center Point */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4 h-4 bg-slate-800 dark:bg-slate-200 rounded-full z-10" />
      </div>
    </div>
  );
};