import React from 'react';
import { motion } from "motion/react";

interface Skill {
  name: string;
  percentage: number;
  icon?: string;
}

interface SkillCategoryData {
  id: string;
  title: string;
  skills: Skill[];
}

interface SkillsProps {
  data: SkillCategoryData[];
}

interface SkillCategoryProps {
  title: string;
  skills: Skill[];
}

const SkillCategory: React.FC<SkillCategoryProps> = ({ title, skills }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-400 dark:border-slate-600 shadow-sm sketch-border"
  >
    <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white hand-font">{title}</h3>
    <div className="space-y-6">
      {skills.map((skill) => (
        <div key={skill.name}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 sketch-font">{skill.name}</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hand-font">{skill.percentage}%</span>
          </div>
          <div className="skill-bar-container">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="skill-bar-fill"
            />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

export const Skills = ({ data }: SkillsProps) => {
  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-primary sketch-font"
        >
          My skills
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {data.map((category) => (
            <SkillCategory key={category.id} title={category.title} skills={category.skills} />
          ))}
        </div>
      </div>
    </section>
  );
};
