import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Download, FileText, FileType, File, Clock, Bot, Cloud, Check } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import { exportNote } from '../../utils/exporter';
import { useStudy } from '../../context/StudyContext';
import AISummarizer from '../ai/AISummarizer';

const CustomToolbar = ({ onTimestamp, onAI, onExport, onSync, isSyncing }) => (
  <div id="toolbar" className="flex flex-wrap gap-2 items-center">
    <span className="ql-formats">
      <select className="ql-header" defaultValue="">
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>
        <option value=""></option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <button className="ql-strike"></button>
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
      <button className="ql-blockquote"></button>
      <button className="ql-code-block"></button>
    </span>
    <span className="ql-formats">
      <select className="ql-color"></select>
      <select className="ql-background"></select>
    </span>
    <span className="ql-formats">
      <button className="ql-clean"></button>
    </span>
    
    {/* Custom Buttons */}
    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
    
    <button onClick={onTimestamp} className="custom-btn text-blue-600 hover:text-blue-700" title="Insert Timestamp">
      <Clock className="w-4 h-4" />
    </button>
    <button onClick={onAI} className="custom-btn text-purple-600 hover:text-purple-700" title="AI Summary">
      <Bot className="w-4 h-4" />
    </button>
    <button onClick={onSync} className="custom-btn text-green-600 hover:text-green-700 relative" title="Cloud Sync">
       {isSyncing ? <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin" /> : <Cloud className="w-4 h-4" />}
    </button>
    
    {/* Export Dropdown Trigger (Handled by parent for now due to complexity in Quill toolbar) */}
  </div>
);

const NoteEditor = () => {
  const { currentVideoId, getCurrentTime, seekTo } = useStudy();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Note');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const quillRef = useRef(null);
  
  // Storage key based on video ID
  const storageKey = currentVideoId ? `note-${currentVideoId}` : 'note-general';
  
  // Debounce content
  const debouncedContent = useDebounce(content, 1000);
  const debouncedTitle = useDebounce(title, 1000);

  // Load notes
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setContent(parsed.content || '');
      setTitle(parsed.title || 'Untitled Note');
    } else {
      setContent('');
      setTitle('Untitled Note');
    }
  }, [storageKey]);

  // Save notes
  useEffect(() => {
    if (debouncedContent || debouncedTitle) {
      localStorage.setItem(storageKey, JSON.stringify({
        title: debouncedTitle,
        content: debouncedContent,
        lastModified: new Date().toISOString()
      }));
    }
  }, [debouncedContent, debouncedTitle, storageKey]);

  // Listen for clicks on timestamps
  useEffect(() => {
    const handleTimestampClick = (e) => {
      if (e.target.classList.contains('timestamp-link')) {
        e.preventDefault();
        const time = parseFloat(e.target.dataset.time);
        if (!isNaN(time)) {
          seekTo(time);
        }
      }
    };

    const editor = document.querySelector('.quill-wrapper');
    if (editor) {
      editor.addEventListener('click', handleTimestampClick);
    }
    return () => {
      if (editor) editor.removeEventListener('click', handleTimestampClick);
    };
  }, [seekTo]);

  // Handlers
  const insertTimestamp = () => {
    const time = getCurrentTime();
    if (time === 0 && !currentVideoId) return; // No video playing
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formatted = `[${minutes}:${seconds.toString().padStart(2, '0')}]`;
    
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    
    // Insert a span with data attribute
    quill.insertText(range.index, formatted, {
      'color': '#2563eb',
      'bold': true
    });
    
    // We need to format it as a link-like object manually via HTML injection if we want a custom class
    // But for simplicity in Quill without custom Blots, we just use text and detect it via regex/click
    // Or we can use `dangerouslyPasteHTML` for a proper span
    
    quill.clipboard.dangerouslyPasteHTML(
        range.index, 
        `<span class="timestamp-link cursor-pointer text-blue-600 hover:underline select-none bg-blue-50 dark:bg-blue-900/30 px-1 rounded mx-1" data-time="${time}">${formatted}</span>&nbsp;`
    );
    
    quill.setSelection(range.index + 2); // Move cursor after
  };

  const handleApplySummary = (summaryText) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    
    quill.insertText(range.index, '\n## AI Summary\n');
    quill.insertText(range.index + 13, summaryText);
    setIsAiOpen(false);
  };

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      alert('Notes synced to cloud! (Simulated)');
    }, 1500);
  };

  const handleExport = (format) => {
    exportNote(format, title, content);
  };

  // Modules config
  const modules = {
    toolbar: {
      container: "#toolbar",
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-950 transition-colors">
      <AISummarizer 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)}
        contextContent={content} // Pass current notes as context
        onApplySummary={handleApplySummary}
      />

      {/* Top Bar */}
      <div className="px-6 py-3 border-b dark:border-gray-800 flex items-center justify-between shrink-0 gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-bold border-none focus:ring-0 p-0 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 w-full bg-transparent"
          placeholder="Note Title"
        />
        
        {/* Export Menu */}
        <div className="relative group shrink-0">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-100 dark:border-gray-800 hidden group-hover:block z-50">
            <div className="py-1">
              {['pdf', 'docx', 'md', 'txt'].map(fmt => (
                <button key={fmt} onClick={() => handleExport(fmt)} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 uppercase">
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Toolbar */}
      <div className="border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-2">
         <CustomToolbar 
           onTimestamp={insertTimestamp} 
           onAI={() => setIsAiOpen(true)}
           onSync={handleSync}
           isSyncing={isSyncing}
         />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden flex flex-col relative quill-wrapper">
         <ReactQuill 
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="flex-1 flex flex-col h-full border-none"
            placeholder={currentVideoId ? "Start typing..." : "Select a video to start..."}
         />
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 flex justify-between">
        <span>{currentVideoId ? `Linked: ${currentVideoId}` : 'General Notes'}</span>
        <span>{content.length} chars</span>
      </div>

      <style>{`
        .quill-wrapper .quill { display: flex; flex-direction: column; height: 100%; }
        .quill-wrapper .ql-container { flex: 1; overflow-y: auto; font-family: 'Inter', sans-serif; font-size: 16px; }
        .quill-wrapper .ql-toolbar { border: none; padding: 12px 16px; }
        .quill-wrapper .ql-editor { padding: 24px 32px; line-height: 1.6; }
        .dark .quill-wrapper .ql-editor { color: #e5e7eb; }
        .dark .ql-toolbar button { color: #9ca3af; }
        .dark .ql-toolbar button:hover { color: #fff; }
        .dark .ql-toolbar .ql-stroke { stroke: #9ca3af; }
        .dark .ql-toolbar .ql-fill { fill: #9ca3af; }
        .custom-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 4px; transition: background-color 0.2s; }
        .custom-btn:hover { background-color: rgba(0,0,0,0.05); }
        .dark .custom-btn:hover { background-color: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default NoteEditor;
