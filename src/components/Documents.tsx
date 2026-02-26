import React, { useState } from 'react';
import { PencilBox } from './PencilBox';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Share2, ChevronDown, Check, ArrowLeft } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  likes: number;
  userLiked?: boolean;
  comments: Array<{ id: string; user: string; text: string; date: string }>;
  shares: number;
  date: string;
}

interface DocumentsProps {
  data: Document[];
  selectedDocId: string | null;
  onSelectDoc: (id: string | null) => void;
  onLike: (id: string) => void;
  onComment: (id: string, comment: string) => void;
  onShare: (id: string) => void;
}

export const Documents: React.FC<DocumentsProps> = ({ data, selectedDocId, onSelectDoc, onLike, onComment, onShare }) => {
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});
  const [showAllComments, setShowAllComments] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}?doc=${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    onShare(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedDoc = data.find(d => d.id === selectedDocId);

  if (selectedDoc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => onSelectDoc(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={20} /> Back to Documents
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PencilBox className="p-8 md:p-12">
            <div className="mb-8">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">{selectedDoc.date}</span>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mt-2">{selectedDoc.title}</h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 mt-2">{selectedDoc.subtitle}</p>
            </div>

            <div className="prose dark:prose-invert max-w-none mt-10">
              <div dangerouslySetInnerHTML={{ __html: selectedDoc.content }} />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-8 mb-10">
                <button
                  onClick={() => onLike(selectedDoc.id)}
                  className={`flex items-center gap-2 transition-colors group ${selectedDoc.userLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                >
                  <Heart size={24} fill={selectedDoc.userLiked ? 'currentColor' : 'none'} className="group-active:scale-125 transition-transform" />
                </button>
                <button
                  onClick={() => handleShare(selectedDoc.id)}
                  className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  {copiedId === selectedDoc.id ? <Check size={24} className="text-emerald-500" /> : <Share2 size={24} />}
                </button>
              </div>
            </div>
          </PencilBox>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 hand-font sketch-stroke">Documents</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          A collection of thought
        </p>
      </div>

      <div className="space-y-8">
        {data.map((doc) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <PencilBox className="overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{doc.date}</span>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{doc.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{doc.subtitle}</p>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none mt-6 max-h-24 overflow-hidden relative">
                  <div dangerouslySetInnerHTML={{ __html: doc.content }} />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => onLike(doc.id)}
                      className={`flex items-center gap-2 transition-colors group ${doc.userLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                    >
                      <Heart size={20} fill={doc.userLiked ? 'currentColor' : 'none'} className="group-active:scale-125 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleShare(doc.id)}
                      className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors"
                    >
                      {copiedId === doc.id ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} />}
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectDoc(doc.id)}
                    className="flex items-center gap-2 text-primary font-bold hover:underline transition-all"
                  >
                    See More <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </PencilBox>
          </motion.div>
        ))}
      </div>
    </div>
  );
};