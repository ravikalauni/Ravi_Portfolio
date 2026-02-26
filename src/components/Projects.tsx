import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  type: string;
  thumbnail: string;
  link: string;
}

interface ProjectsProps {
  data: {
    heading: string;
    description: string;
    items: ProjectItem[];
  };
}

export const Projects = ({ data }: ProjectsProps) => {
  return (
    <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-primary mb-4 sketch-font"
          >
            {data.heading}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium hand-font text-xl"
          >
            {data.description}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border-2 border-slate-400 dark:border-slate-600 shadow-sm group sketch-border"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 sketch-img"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 sketch-border"
                  >
                    View Project
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors hand-font">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold sketch-font">
                  {project.type}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
