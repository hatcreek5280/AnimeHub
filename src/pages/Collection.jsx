import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, Clock, CheckCircle, PlayCircle, XCircle } from 'lucide-react';
import { useGamificationStore } from '../store/gamificationStore';

const StatusBadge = ({ status }) => {
    const styles = {
        watching: 'bg-green-500/20 text-green-400 border-green-500/50',
        completed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        plan_to_watch: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
        dropped: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    const labels = {
        watching: 'Watching',
        completed: 'Completed',
        plan_to_watch: 'Plan to Watch',
        dropped: 'Dropped',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
            {labels[status]}
        </span>
    );
};

const Collection = () => {
    const { collection, removeFromCollection, updateAnimeStatus } = useGamificationStore();
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all'
        ? collection
        : collection.filter(a => a.status === filter);

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'watching', label: 'Watching' },
        { id: 'completed', label: 'Completed' },
        { id: 'plan_to_watch', label: 'Plan to Watch' },
        { id: 'dropped', label: 'Dropped' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <h1 className="text-3xl font-display font-bold text-white">
                    My Collection <span className="text-slate-500 text-lg ml-2">({collection.length})</span>
                </h1>

                <div className="flex bg-surface/50 p-1 rounded-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === tab.id
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((anime) => (
                        <motion.div
                            key={anime.mal_id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card flex gap-4 group"
                        >
                            <img
                                src={anime.images.jpg.image_url}
                                alt={anime.title}
                                className="w-24 h-32 object-cover rounded-xl shadow-md"
                            />

                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-bold text-white truncate">{anime.title}</h3>
                                    <button
                                        onClick={() => removeFromCollection(anime.mal_id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mt-2 mb-auto">
                                    <StatusBadge status={anime.status} />
                                </div>

                                <div className="flex items-center gap-2 mt-4">
                                    <select
                                        value={anime.status}
                                        onChange={(e) => updateAnimeStatus(anime.mal_id, e.target.value)}
                                        className="bg-surface border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none focus:border-primary/50"
                                    >
                                        <option value="watching">Watching</option>
                                        <option value="completed">Completed</option>
                                        <option value="plan_to_watch">Plan to Watch</option>
                                        <option value="dropped">Dropped</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <p className="text-xl">No anime found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Collection;
