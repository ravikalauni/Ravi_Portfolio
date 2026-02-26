import { motion } from "motion/react";

interface AboutProps {
  data: {
    title: string;
    image: string;
    text: string;
    cards: Array<{
      id: string;
      title: string;
      items: string[];
    }>;
  };
}

export const About = ({ data }: AboutProps) => {
  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-primary sketch-font"
        >
          {data.title}
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-slate-400 dark:border-slate-600 p-2 sketch-border">
              <img 
                src={data.image} 
                alt="Ravi Kalauni" 
                className="w-full h-full object-cover rounded-full sketch-img grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-primary rounded-full border-4 border-white dark:border-slate-900 shadow-lg" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 p-8 rounded-3xl sketch-border sketch-fill"
          >
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 hand-font">
              {data.text}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.cards.map((card, idx) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-slate-400 dark:border-slate-600 shadow-sm sketch-border"
            >
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 hand-font">
                <span className="w-3 h-3 bg-primary rounded-full" />
                {card.title}
              </h3>
              <ul className="space-y-4">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium sketch-font">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
