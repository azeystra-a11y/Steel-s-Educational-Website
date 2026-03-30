/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Search, Cat, X, Maximize2, Minimize2, Play, Info, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation, useParams, Link, useSearchParams } from 'react-router-dom';
import gamesData from './games.json';
import animeData from './anime.json';

function GamesPage() {
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
    <>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="relative group max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-purple-500/20 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

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
                className="group cursor-pointer bg-black border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                id={`game-card-${game.id}`}
              >
                <div className="aspect-video relative overflow-hidden bg-[#050505]">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      Play Now
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors truncate">
                    {game.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white/5 p-6 rounded-full mb-4 border border-purple-500/20">
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
              className={`bg-black w-full h-full flex flex-col shadow-2xl overflow-hidden border border-purple-500/30 ${
                isFullscreen ? 'fixed inset-0 rounded-0 border-0' : 'max-w-6xl max-h-[90vh] md:rounded-3xl'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-black">
                <div className="flex items-center gap-3">
                  <h2 className="font-bold text-lg truncate max-w-[200px] md:max-w-md">
                    {selectedGame.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-purple-400"
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
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-red-400"
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
              <div className="px-6 py-3 bg-black border-t border-purple-500/20 flex justify-between items-center text-xs text-white/40">
                <span>Playing: {selectedGame.title}</span>
                <span className="hidden md:inline">Press ESC to exit fullscreen</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AnimePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnime = useMemo(() => {
    return animeData.filter(anime =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <>
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <div className="relative group max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
          <input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-purple-500/20 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {filteredAnime.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnime.map((anime) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="block"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-black border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500 transition-colors shadow-[0_0_10px_rgba(168,85,247,0.05)] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                  id={`anime-card-${anime.id}`}
                >
                  <div className="aspect-video relative overflow-hidden bg-[#050505]">
                    <img
                      src={anime.thumbnail}
                      alt={anime.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        Watch Now
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors truncate">
                      {anime.title}
                    </h3>
                    <p className="text-xs text-white/40 mt-2 line-clamp-2">
                      {anime.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-white/5 p-6 rounded-full mb-4 border border-purple-500/20">
              <Search className="w-12 h-12 text-white/20" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No anime found</h2>
            <p className="text-white/40">Try searching for something else</p>
          </div>
        )}
      </main>
    </>
  );
}

function AnimePlayerPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentEp = parseInt(searchParams.get('ep') || '1');
  const [epSearch, setEpSearch] = useState('');
  const [server, setServer] = useState('VidSrc');
  const [isLoading, setIsLoading] = useState(true);
  
  const anime = useMemo(() => animeData.find(a => a.id === parseInt(id)), [id]);

  useEffect(() => {
    setIsLoading(true);
  }, [currentEp, server]);

  if (!anime) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Anime not found</h2>
        <Link to="/anime" className="text-purple-400 hover:underline">Back to Anime</Link>
      </div>
    );
  }

  const handleEpChange = (ep) => {
    setSearchParams({ ep: ep.toString() });
    setEpSearch('');
  };

  // Generate episode list
  const episodes = Array.from({ length: anime.episodes || 1 }, (_, i) => i + 1);
  const filteredEpisodes = episodes.filter(ep => ep.toString().includes(epSearch));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumbs / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/anime" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-purple-400">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{anime.title}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Episode {currentEp}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="text-xs text-white/40 uppercase tracking-wider">{anime.status || 'Ongoing'}</span>
            </div>
          </div>
        </div>
        
        {/* Server Selector */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-purple-500/10">
          {['VidSrc', 'Gogo', 'Zoro'].map((s) => (
            <button
              key={s}
              onClick={() => setServer(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                server === s 
                  ? 'bg-purple-500 text-white shadow-lg' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-3">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] relative group">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            )}
            <iframe
              src={`${anime.embedUrl || 'https://vidsrc.me/embed/anime/naruto'}/${currentEp}`}
              className="w-full h-full border-none"
              title={`${anime.title} - Episode ${currentEp}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-purple-500/10">
            <button
              disabled={currentEp <= 1}
              onClick={() => handleEpChange(currentEp - 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-20 disabled:cursor-not-allowed rounded-xl transition-all text-purple-400 font-bold text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Play className="w-3 h-3 text-purple-400 fill-current" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Auto Play</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                <Play className="w-3 h-3 text-purple-400 fill-current" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Auto Next</span>
              </div>
            </div>

            <button
              disabled={currentEp >= (anime.episodes || 1)}
              onClick={() => handleEpChange(currentEp + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-20 disabled:cursor-not-allowed rounded-xl transition-all text-purple-400 font-bold text-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-purple-400" />
                Synopsis
              </h3>
              <p className="text-white/60 leading-relaxed text-lg">
                {anime.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {anime.genres?.map(genre => (
                  <span key={genre} className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs font-bold text-purple-400 uppercase tracking-wider">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 p-6 rounded-3xl border border-purple-500/10 h-fit">
              <h4 className="font-bold text-sm uppercase tracking-widest text-white/40 mb-4">Details</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Rating</span>
                  <span className="text-sm font-bold text-purple-400">{anime.rating || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Year</span>
                  <span className="text-sm font-bold">{anime.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Episodes</span>
                  <span className="text-sm font-bold">{anime.episodes || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Status</span>
                  <span className="text-sm font-bold text-green-400">{anime.status || 'Ongoing'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 rounded-3xl border border-purple-500/10 h-[700px] flex flex-col overflow-hidden sticky top-28">
            <div className="p-6 border-b border-purple-500/10">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Episodes</h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                <input
                  type="text"
                  placeholder="Search ep..."
                  value={epSearch}
                  onChange={(e) => setEpSearch(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/10"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {filteredEpisodes.length > 0 ? (
                filteredEpisodes.map((ep) => (
                  <button
                    key={ep}
                    onClick={() => handleEpChange(ep)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl transition-all flex items-center justify-between group ${
                      currentEp === ep 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                        : 'hover:bg-white/10 text-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold ${currentEp === ep ? 'text-white/60' : 'text-white/20'}`}>
                        {ep.toString().padStart(2, '0')}
                      </span>
                      <span className="font-bold text-sm">Episode {ep}</span>
                    </div>
                    {currentEp === ep && <Play className="w-3 h-3 fill-current" />}
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-white/20 text-xs">No episodes found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-purple-500/30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold tracking-tighter uppercase italic">
                Steel's <span className="text-purple-400">Website</span>
              </h1>
              
              <nav className="flex items-center gap-6">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `text-sm font-bold uppercase tracking-widest transition-colors hover:text-purple-400 ${
                      isActive ? 'text-purple-400 border-b-2 border-purple-400 pb-1' : 'text-white/60'
                    }`
                  }
                >
                  Games
                </NavLink>
                <NavLink 
                  to="/anime" 
                  className={({ isActive }) => 
                    `text-sm font-bold uppercase tracking-widest transition-colors hover:text-purple-400 ${
                      isActive ? 'text-purple-400 border-b-2 border-purple-400 pb-1' : 'text-white/60'
                    }`
                  }
                >
                  Anime
                </NavLink>
              </nav>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<GamesPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/anime/:id" element={<AnimePlayerPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 py-12 px-6 mt-12 bg-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 opacity-50">
              <Cat className="w-5 h-5 text-purple-400" />
              <span className="font-bold tracking-tighter uppercase italic text-sm">
                Steel's Website
              </span>
            </div>
            <p className="text-xs text-white/20">
              © {new Date().getFullYear()} Steel's Website. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
