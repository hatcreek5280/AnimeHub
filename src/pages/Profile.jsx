import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Award } from 'lucide-react';
import { useGamificationStore } from '../store/gamificationStore';

const Badge = ({ badge, unlocked }) => (
    <div className={`flex flex-col items-center p-4 rounded-2xl border ${unlocked
            ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50'
            : 'bg-surface/30 border-white/5 opacity-50 grayscale'
        }`}>
        <div className="text-4xl mb-3">{badge.icon}</div>
        <h3 className="font-bold text-sm text-white mb-1">{badge.name}</h3>
        <p className="text-xs text-slate-400 text-center">{badge.description}</p>
    </div>
);

const Profile = () => {
    const { xp, level, title, badges, collection } = useGamificationStore();

    const allBadges = [
        { id: 'first_anime', name: 'First Step', description: 'Add your first anime', icon: '🌱' },
        { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🎓' },
        { id: 'collector_10', name: 'Collector', description: 'Collect 10 anime', icon: '📚' },
        { id: 'genre_explorer', name: 'Genre Explorer', description: 'Watch 5 genres', icon: '🌍' },
    ];

    // Calculate progress to next level (simplified)
    const nextLevelXp = 500; // Just a placeholder logic, store has real logic but not exposed easily
    const progress = (xp % 500) / 500 * 100;

    return (
        <div className="space-y-8">
            {/* Header Card */}
            <div className="glass-card relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Trophy size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="Avatar"
                                className="w-full h-full"
                            />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">Otaku User</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm font-bold">
                                Level {level}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/50 text-sm font-bold">
                                {title}
                            </span>
                        </div>

                        <div className="w-full max-w-md bg-surface rounded-full h-4 overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-right max-w-md">{xp} XP Total</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card p-4 text-center">
                    <div className="text-primary mb-2 flex justify-center"><Star /></div>
                    <div className="text-2xl font-bold text-white">{collection.length}</div>
                    <div className="text-xs text-slate-400">Anime Collected</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-secondary mb-2 flex justify-center"><Zap /></div>
                    <div className="text-2xl font-bold text-white">{collection.filter(a => a.status === 'completed').length}</div>
                    <div className="text-xs text-slate-400">Completed</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-accent mb-2 flex justify-center"><Award /></div>
                    <div className="text-2xl font-bold text-white">{badges.length}</div>
                    <div className="text-xs text-slate-400">Badges Earned</div>
                </div>
                <div className="glass-card p-4 text-center">
                    <div className="text-green-400 mb-2 flex justify-center"><Clock /></div>
                    <div className="text-2xl font-bold text-white">0h</div>
                    <div className="text-xs text-slate-400">Watch Time</div>
                </div>
            </div>

            {/* Badges */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {allBadges.map(badge => (
                        <Badge
                            key={badge.id}
                            badge={badge}
                            unlocked={badges.includes(badge.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
