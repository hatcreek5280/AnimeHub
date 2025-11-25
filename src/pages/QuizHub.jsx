import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Trophy } from 'lucide-react';

const QuizOption = ({ title, description, icon: Icon, color, path, delay }) => {
    const navigate = useNavigate();

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(path)}
            className="relative group overflow-hidden rounded-3xl p-8 text-left w-full h-full glass-card border-t border-white/10 flex flex-col items-center text-center"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-${color.split('-')[1]}/50 transition-shadow duration-300`}>
                <Icon size={40} className="text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-slate-400 group-hover:text-slate-300 transition-colors mb-6">
                {description}
            </p>

            <div className="mt-auto px-6 py-2 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors text-sm font-bold text-white">
                Start Quiz
            </div>
        </motion.button>
    );
};

const QuizHub = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-12 py-10">
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block p-4 rounded-full bg-surface/50 mb-4"
                >
                    <Trophy size={48} className="text-yellow-400" />
                </motion.div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                    Quiz Arena
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Test your knowledge, earn XP, and prove your Otaku status. Choose your challenge below!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <QuizOption
                    title="General Trivia"
                    description="Test your knowledge on anime series, genres, years, and synopses. Pure text-based challenge."
                    icon={BookOpen}
                    color="from-blue-500 to-cyan-500"
                    path="/quizzes/general"
                    delay={0.1}
                />
                <QuizOption
                    title="Character Challenge"
                    description="Identify characters, their voice actors, nicknames, and the anime they belong to."
                    icon={User}
                    color="from-pink-500 to-rose-500"
                    path="/quizzes/character"
                    delay={0.2}
                />
            </div>
        </div>
    );
};

export default QuizHub;
