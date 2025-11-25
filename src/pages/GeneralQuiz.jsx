import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { getTopAnime } from '../utils/api';
import { useGamificationStore } from '../store/gamificationStore';

const GeneralQuiz = () => {
    const { addXp, unlockBadge } = useGamificationStore();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizComplete, setQuizComplete] = useState(false);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const page = Math.floor(Math.random() * 5) + 1;
            const data = await getTopAnime(page);
            const animeList = data.data || [];

            if (animeList.length < 4) throw new Error('Not enough anime');

            const newQuestions = [];
            for (let i = 0; i < 5; i++) {
                const shuffled = [...animeList].sort(() => Math.random() - 0.5).slice(0, 4);
                const correct = shuffled[0];
                const options = shuffled.sort(() => Math.random() - 0.5);

                // Text-based question types
                const types = ['synopsis', 'year', 'episodes'];
                const type = types[Math.floor(Math.random() * types.length)];

                let questionText = '';
                if (type === 'synopsis') {
                    questionText = `Which anime has this synopsis?\n"${correct.synopsis?.slice(0, 150)}..."`;
                } else if (type === 'year') {
                    questionText = `Which anime was released in ${correct.year || correct.aired?.prop?.from?.year || 'Unknown'}?`;
                } else {
                    questionText = `Which anime has ${correct.episodes || '?'} episodes?`;
                }

                newQuestions.push({
                    id: i,
                    correct,
                    options,
                    question: questionText
                });
            }
            setQuestions(newQuestions);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
    }, []);

    const handleAnswer = (anime) => {
        if (showResult) return;

        setSelectedAnswer(anime);
        setShowResult(true);

        const isCorrect = anime.mal_id === questions[currentIndex].correct.mal_id;
        if (isCorrect) {
            setScore(s => s + 1);
            addXp(20);
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
                setShowResult(false);
                setSelectedAnswer(null);
            } else {
                setQuizComplete(true);
                addXp(50);
                if (isCorrect && score + 1 === questions.length) {
                    unlockBadge('quiz_master');
                }
            }
        }, 2000);
    };

    const restartQuiz = () => {
        setQuizComplete(false);
        setCurrentIndex(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        loadQuestions();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-400">Preparing trivia questions...</p>
            </div>
        );
    }

    if (quizComplete) {
        return (
            <div className="max-w-2xl mx-auto text-center py-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-10"
                >
                    <Trophy size={80} className="mx-auto text-yellow-400 mb-6" />
                    <h2 className="text-4xl font-bold text-white mb-4">Trivia Complete!</h2>
                    <p className="text-2xl text-slate-300 mb-8">
                        You scored <span className="text-primary font-bold">{score}/{questions.length}</span>
                    </p>
                    <button
                        onClick={restartQuiz}
                        className="px-8 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl font-bold transition-colors"
                    >
                        Play Again
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-primary" /> General Trivia
                </h1>
                <div className="bg-surface px-4 py-2 rounded-full text-primary font-bold">
                    {currentIndex + 1}/{questions.length}
                </div>
            </div>

            <div className="glass-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center whitespace-pre-line">
                    {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((anime) => {
                        const isSelected = selectedAnswer?.mal_id === anime.mal_id;
                        const isCorrect = anime.mal_id === currentQuestion.correct.mal_id;

                        let buttonStyle = "bg-surface/50 hover:bg-surface text-slate-300";
                        if (showResult) {
                            if (isCorrect) buttonStyle = "bg-green-500 text-white border-green-400";
                            else if (isSelected) buttonStyle = "bg-red-500 text-white border-red-400";
                            else buttonStyle = "bg-surface/30 text-slate-500 opacity-50";
                        }

                        return (
                            <button
                                key={anime.mal_id}
                                onClick={() => handleAnswer(anime)}
                                disabled={showResult}
                                className={`p-4 rounded-xl text-left font-medium transition-all border border-transparent ${buttonStyle}`}
                            >
                                {anime.title}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GeneralQuiz;
