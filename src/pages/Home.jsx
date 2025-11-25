import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Trophy, Library, User } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, color, delay, onClick }) => (
    <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative group overflow-hidden rounded-3xl p-8 text-left w-full h-full glass-card border-t border-white/10`}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

        <div className="relative z-10 flex flex-col h-full">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-${color.split('-')[1]}/50 transition-shadow duration-300`}>
                <Icon size={32} className="text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                {description}
            </p>

            <div className="mt-auto pt-6 flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                <span>Explore</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </div>
    </motion.button>
);

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Discovery',
            description: 'Find your next favorite anime with our mood-based search.',
            icon: Compass,
            color: 'from-blue-500 to-cyan-500',
            path: '/discovery'
        },
        {
            title: 'Quiz Arena',
            description: 'Test your knowledge and earn XP to level up your profile.',
            icon: Trophy,
            color: 'from-pink-500 to-rose-500',
            path: '/quizzes'
        },
        {
            title: 'My Collection',
            description: 'Track what you\'ve watched and build your library.',
            icon: Library,
            color: 'from-purple-500 to-indigo-500',
            path: '/collection'
        },
        {
            title: 'Profile',
            description: 'View your stats, badges, and Otaku level.',
            icon: User,
            color: 'from-orange-500 to-amber-500',
            path: '/profile'
        }
    ];

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-10 md:py-20 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <h1 className="font-display text-5xl md:text-7xl mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-2xl">
                        ANIME HUB
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
                        Your ultimate gateway to the anime universe. Discover, track, and level up your otaku status.
                    </p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full -z-10 animate-pulse" />
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                    <FeatureCard
                        key={feature.title}
                        {...feature}
                        delay={idx * 0.1}
                        onClick={() => navigate(feature.path)}
                    />
                ))}
            </section>

            {/* Anime of the Day Placeholder - To be implemented with API */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card mt-12 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4">
                    <Sparkles className="text-yellow-400 animate-spin-slow" size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span> Anime of the Day
                </h2>
                <p className="text-slate-400">Loading daily recommendation...</p>
            </motion.div>
        </div>
    );
};

export default Home;
