import React, { useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { GripVertical, Moon, Sun } from 'lucide-react';
import VideoPlayer from '../player/VideoPlayer';
import NoteEditor from '../editor/NoteEditor';

const MainLayout = () => {
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-900 border-b dark:border-gray-800 flex items-center px-4 justify-between shrink-0 z-10 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            StudyCompanion
          </span>
        </div>
        <div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" autoSaveId="persistence">
          {/* Left Panel: Video Player */}
          <Panel defaultSize={50} minSize={20} className="bg-gray-900 border-r dark:border-gray-800">
            <VideoPlayer onVideoLoad={setCurrentVideoId} />
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors flex items-center justify-center cursor-col-resize z-20">
            <div className="h-8 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
          </PanelResizeHandle>

          {/* Right Panel: Editor */}
          <Panel defaultSize={50} minSize={20} className="bg-white dark:bg-gray-950">
            <NoteEditor videoId={currentVideoId} />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default MainLayout;
