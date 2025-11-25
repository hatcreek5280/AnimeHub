import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Check } from 'lucide-react';
import { searchAnime, getTopAnime } from '../utils/api';
import { useGamificationStore } from '../store/gamificationStore';

const AnimeCard = ({ anime }) => {
    const { addToCollection, collection } = useGamificationStore();
    const isCollected = collection.some(a => a.mal_id === anime.mal_id);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="glass-card p-0 overflow-hidden group relative"
        >
            <div className="relative aspect-[2/3]">
                <img
                    src={anime.images.jpg.large_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

                {/* Score Badge */}
                <div className="absolute top-2 right-2 bg-yellow-500/90 text-black font-bold px-2 py-1 rounded-lg text-xs backdrop-blur-sm">
                    ⭐ {anime.score || 'N/A'}
                </div>

                {/* Add Button */}
                <button
                    onClick={() => !isCollected && addToCollection(anime)}
                    disabled={isCollected}
                    className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${isCollected ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/80'
                        }`}
                >
                    {isCollected ? <Check size={20} /> : <Plus size={20} />}
                </button>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-white truncate mb-1">{anime.title}</h3>
                <p className="text-xs text-slate-400 mb-2">
                    {anime.year || 'Unknown'} • {anime.type} • {anime.episodes || '?'} eps
                </p>
                <div className="flex flex-wrap gap-1">
                    {anime.genres.slice(0, 2).map(g => (
                        <span key={g.mal_id} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-slate-300">
                            {g.name}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

const Discovery = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [activeMood, setActiveMood] = useState(null);

    const moods = [
        { id: 'hype', label: '🔥 Hype', genres: '1,27' }, // Action, Shounen
        { id: 'chill', label: '🍃 Chill', genres: '36' }, // Slice of Life
        { id: 'cry', label: '😭 Emotional', genres: '8' }, // Drama
        { id: 'scary', label: '👻 Scary', genres: '14' }, // Horror
        { id: 'laugh', label: '😂 Funny', genres: '4' }, // Comedy
        { id: 'love', label: '💖 Romantic', genres: '22' }, // Romance
    ];

    const fetchInitial = async () => {
        setLoading(true);
        try {
            const data = await getTopAnime();
            setResults(data.data || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        setActiveMood(null);
        try {
            const data = await searchAnime({ q: query, sfw: true, limit: 24 });
            setResults(data.data || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleMood = async (mood) => {
        setActiveMood(mood.id);
        setQuery('');
        setLoading(true);
        try {
            const data = await searchAnime({ genres: mood.genres, order_by: 'score', sort: 'desc', sfw: true, limit: 24 });
            setResults(data.data || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <h1 className="text-3xl font-display font-bold text-white">Discovery</h1>

                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </form>
            </div>

            {/* Mood Selector */}
            <div className="flex flex-wrap gap-3">
                {moods.map(mood => (
                    <button
                        key={mood.id}
                        onClick={() => handleMood(mood)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeMood === mood.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-surface/50 text-slate-400 hover:bg-surface hover:text-white'
                            }`}
                    >
                        {mood.label}
                    </button>
                ))}
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {results.map((anime) => (
                        <AnimeCard key={anime.mal_id} anime={anime} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Discovery;
