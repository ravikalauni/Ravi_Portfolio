import { motion } from "motion/react";
import { Github, Linkedin, Mail, Twitter, Globe } from "lucide-react";
import { BinaryClock } from "./BinaryClock";

interface HeroProps {
  data: {
    title: string;
    subtitle: string;
    buttons: Array<{ id: string; label: string; link: string; primary: boolean }>;
    socials: Array<{ id: string; platform: string; link: string }>;
  };
}

const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'github': return <Github size={24} />;
    case 'linkedin': return <Linkedin size={24} />;
    case 'mail': return <Mail size={24} />;
    case 'twitter': return <Twitter size={24} />;
    default: return <Globe size={24} />;
  }
};

export const Hero = ({ data }: HeroProps) => {
  return (
    <section className="pt-0 pb-15 md:pt-14 md:pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sketch-font whitespace-pre-line">
              {data.title.includes(',') ? (
                <>
                  {data.title.split(',')[0]},<br />
                  <span className="text-primary sketch-stroke">{data.title.split(',')[1]}</span>
                </>
              ) : (
                <span className="text-primary sketch-stroke">{data.title}</span>
              )}
            </h1>

            <div className="inline-block border-2 border-slate-400 dark:border-slate-600 px-4 py-2 rounded-lg mb-8 transform rotate-1 sketch-border sketch-fill">
              <p className="text-slate-700 dark:text-slate-300 font-bold hand-font text-xl">
                {data.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
              {data.buttons.map((btn) => (
                <a
                  key={btn.id}
                  href={btn.link}
                  className={`${btn.primary
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-slate-900 border-2 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white"
                    } px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg sketch-border flex items-center justify-center`}
                >
                  {btn.label}
                </a>
              ))}
            </div>

            <div className="flex justify-center md:justify-start gap-4">
              {data.socials.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2, rotate: 5 }}
                  className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl shadow-md sketch-border"
                >
                  {getIcon(social.platform)}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <BinaryClock />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="h-px bg-primary/20 w-full" />
      </div>
    </section>
  );
};
