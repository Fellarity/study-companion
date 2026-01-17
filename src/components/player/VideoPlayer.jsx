import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Link as LinkIcon } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

const VideoPlayer = () => {
  const [url, setUrl] = useState('');
  const { setCurrentVideoId, registerPlayer } = useStudy();
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract ID from URL to set the global video context
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    const id = getYouTubeId(inputUrl);
    if (id) {
      setCurrentVideoId(id);
    }
  };

  // Pass the internal player reference to the context whenever it changes
  useEffect(() => {
    if (playerRef.current) {
      registerPlayer(playerRef.current);
    }
  }, [playerRef, registerPlayer]);

  return (
    <div className="h-full flex flex-col bg-gray-950 text-white">
      {/* URL Input Bar */}
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex gap-3 items-center shrink-0">
        <LinkIcon className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Paste YouTube Video URL..."
          className="flex-1 bg-transparent border-none text-sm text-white focus:ring-0 placeholder-gray-500"
          value={url}
          onChange={handleUrlChange}
        />
      </div>

      {/* Player Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {url ? (
          <div className="absolute top-0 left-0 w-full h-full">
            <ReactPlayer
              ref={playerRef}
              url={url}
              width="100%"
              height="100%"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 flex flex-col items-center">
            <Play className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No video loaded</p>
            <p className="text-sm mt-2 opacity-60">Paste a URL above to start studying</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
