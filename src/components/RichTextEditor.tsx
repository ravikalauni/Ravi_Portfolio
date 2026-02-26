import React, { useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Link as LinkIcon, Image as ImageIcon, 
  AlignLeft, AlignCenter, AlignRight, Undo, Redo 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className = '' }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (Math.abs(editorRef.current.innerHTML.length - value.length) > 5 || !editorRef.current.innerHTML) {
         editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Restore focus before inserting
        editorRef.current?.focus();
        execCommand('insertImage', result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ToolbarButton = ({ icon, command, arg, title }: { icon: React.ReactNode, command: string, arg?: string, title: string }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent focus loss
        execCommand(command, arg);
      }}
      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className={`border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <ToolbarButton icon={<Bold size={18} />} command="bold" title="Bold" />
        <ToolbarButton icon={<Italic size={18} />} command="italic" title="Italic" />
        <ToolbarButton icon={<Underline size={18} />} command="underline" title="Underline" />
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
        <ToolbarButton icon={<Heading1 size={18} />} command="formatBlock" arg="H1" title="Heading 1" />
        <ToolbarButton icon={<Heading2 size={18} />} command="formatBlock" arg="H2" title="Heading 2" />
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
        <ToolbarButton icon={<List size={18} />} command="insertUnorderedList" title="Bullet List" />
        <ToolbarButton icon={<ListOrdered size={18} />} command="insertOrderedList" title="Numbered List" />
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
        <ToolbarButton icon={<AlignLeft size={18} />} command="justifyLeft" title="Align Left" />
        <ToolbarButton icon={<AlignCenter size={18} />} command="justifyCenter" title="Align Center" />
        <ToolbarButton icon={<AlignRight size={18} />} command="justifyRight" title="Align Right" />
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
        <ToolbarButton icon={<Undo size={18} />} command="undo" title="Undo" />
        <ToolbarButton icon={<Redo size={18} />} command="redo" title="Redo" />
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt('Enter link URL:');
            if (url) execCommand('createLink', url);
          }}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          title="Insert Link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            // Ask user for URL or Upload
            const choice = confirm('Click OK to upload an image, or Cancel to enter a URL.');
            if (choice) {
                fileInputRef.current?.click();
            } else {
                const url = prompt('Enter image URL:');
                if (url) execCommand('insertImage', url);
            }
          }}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
          title="Insert Image"
        >
          <ImageIcon size={18} />
        </button>
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*"
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] outline-none prose dark:prose-invert max-w-none"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
};
