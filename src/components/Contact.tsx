import React, { useState, FormEvent } from 'react';
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

interface ContactProps {
  data: {
    title: string;
    subtitle: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    namePlaceholder: string;
    emailPlaceholder: string;
  };
  onSubmit?: (name: string, email: string, message: string) => void;
}

export const Contact = ({ data, onSubmit }: ContactProps) => {
  const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData.name, formData.email, formData.message);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-primary sketch-font"
        >
          {data.title}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 hand-font">{data.subtitle}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium sketch-font">
              {data.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center sketch-border">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold hand-font">Email</p>
                  <p className="font-bold sketch-font">{data.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center sketch-border">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold hand-font">Phone</p>
                  <p className="font-bold sketch-font">{data.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl flex items-center justify-center sketch-border">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold hand-font">Location</p>
                  <p className="font-bold sketch-font">{data.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 p-8 border-2 border-slate-400 dark:border-slate-600 sketch-border sketch-fill"
            onSubmit={handleSubmit}
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4 pencil-border">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2 hand-font">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400 sketch-font">Thank you for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 hand-font">Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 px-4 py-3 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all sketch-border-sm"
                      placeholder={data.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 hand-font">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 px-4 py-3 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all sketch-border-sm"
                      placeholder={data.emailPlaceholder}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2 hand-font">Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600 px-4 py-3 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none transition-all sketch-border-sm"
                    placeholder="Your message here..."
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] sketch-border border-none"
                >
                  Send Message
                  <Send size={20} />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
};
