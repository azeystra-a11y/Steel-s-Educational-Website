/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic">
              Unblocked<span className="text-orange-500">Hub</span>
            </h1>
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-white/20"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layoutId={`game-${game.id}`}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedGame(game)}
                className="group cursor-pointer bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors"
                id={`game-card-${game.id}`}
              >
                <div className="aspect-video relative overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Play Now
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg group-hover:text-orange-500 transition-colors truncate">
                    {game.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white/5 p-6 rounded-full mb-4">
              <Search className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No games found</h2>
            <p className="text-white/40">Try searching for something else</p>
          </div>
        )}
      </main>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`game-${selectedGame.id}`}
              className={`bg-[#0a0a0a] w-full h-full flex flex-col shadow-2xl overflow-hidden ${
                isFullscreen ? 'fixed inset-0 rounded-0' : 'max-w-6xl max-h-[90vh] md:rounded-3xl border border-white/10'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#141414]">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 p-1.5 rounded-md">
                    <Gamepad2 className="w-4 h-4 text-black" />
                  </div>
                  <h2 className="font-bold text-lg truncate max-w-[200px] md:max-w-md">
                    {selectedGame.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    title="Toggle Fullscreen"
                    id="btn-fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGame(null);
                      setIsFullscreen(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
                    id="btn-close-modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 bg-[#141414] border-t border-white/10 flex justify-between items-center text-xs text-white/40">
                <span>Playing: {selectedGame.title}</span>
                <span className="hidden md:inline">Press ESC to exit fullscreen</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold tracking-tighter uppercase italic text-sm">
              Unblocked Hub
            </span>
          </div>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-orange-500 transition-colors">Home</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Games</a>
            <a href="#" className="hover:text-orange-500 transition-colors">About</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Unblocked Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
