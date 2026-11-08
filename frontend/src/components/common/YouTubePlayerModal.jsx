import React from 'react';
import { X, ExternalLink, Play, Copy, Check, Tv } from 'lucide-react';
import { useSubjects } from '../../context/SubjectContext';
import { useToast } from '../../context/ToastContext';

const YouTubePlayerModal = () => {
  const { activeVideo, closeVideoPlayer } = useSubjects();
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!activeVideo) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeVideo.url);
    setCopied(true);
    success('YouTube link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isEmbeddable = activeVideo.embedUrl && !activeVideo.embedUrl.includes('youtube.com/results');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={closeVideoPlayer}
    >
      <div
        className="w-full max-w-4xl rounded-3xl glass-cyber border border-primary-500/30 shadow-2xl overflow-hidden text-white relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-cyber-cyan" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-primary-500/20 bg-cyber-dark/80">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  YouTube Lecture
                </span>
                <span className="text-xs text-cyber-cyan font-bold">
                  {activeVideo.subject}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5">
                {activeVideo.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeVideoPlayer}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Box / Iframe */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {isEmbeddable ? (
            <iframe
              src={activeVideo.embedUrl}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 space-y-4 max-w-md">
              <div className="w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Curated YouTube Search</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Click below to open high-yield video tutorials for this topic on YouTube
                </p>
              </div>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-cyber-dark/80 border-t border-primary-500/20 text-xs">
          <div className="text-gray-400">
            Channel: <span className="text-white font-semibold">{activeVideo.channel}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-cyber border border-primary-500/30 text-gray-300 hover:text-white transition-colors text-xs font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <a
              href={activeVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition-all text-xs"
            >
              <span>Open in YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayerModal;
