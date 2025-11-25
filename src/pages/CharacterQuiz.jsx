import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, CheckCircle, XCircle } from 'lucide-react';
import { getTopCharacters, getCharacterDetails, getRandomCharacters } from '../utils/api';
import { useGamificationStore } from '../store/gamificationStore';

const CharacterQuiz = () => {
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
            const data = await getRandomCharacters();
            const charList = data.data || [];

            if (charList.length < 4) throw new Error('Not enough characters');

            const newQuestions = [];
            for (let i = 0; i < 5; i++) {
                const shuffled = [...charList].sort(() => Math.random() - 0.5).slice(0, 4);
                const correct = shuffled[0];

                // Fetch full details for nicknames/voices if possible
                let fullDetails = null;
                try {
                    // Add a small delay to avoid rate limits in the loop
                    await new Promise(r => setTimeout(r, 500));
                    const details = await getCharacterDetails(correct.mal_id);
                    fullDetails = details.data;
                } catch (e) {
                    console.warn('Could not fetch full details');
                }

                const options = shuffled.sort(() => Math.random() - 0.5);

                // Determine Question Type
                const types = ['name'];
                if (fullDetails?.nicknames?.length > 0) types.push('nickname');

                const type = types[Math.floor(Math.random() * types.length)];

                let questionText = '';
                let preparedOptions = [];

                if (type === 'nickname') {
                    questionText = "Which of these is a nickname for this character?";
                    const correctNick = fullDetails.nicknames[0];
                    preparedOptions = options.map(opt => ({
                        id: opt.mal_id,
                        text: opt.mal_id === correct.mal_id ? correctNick : (opt.name.split(' ')[0] || 'Unknown'),
                        isCorrect: opt.mal_id === correct.mal_id
                    }));
                } else {
                    // Default: Name
                    questionText = "What is this character's name?";
                    preparedOptions = options.map(opt => ({
                        id: opt.mal_id,
                        text: opt.name,
                        isCorrect: opt.mal_id === correct.mal_id
                    }));
                }

                newQuestions.push({
                    id: i,
                    correct,
                    image: correct.images.jpg.large_image_url || correct.images.jpg.image_url,
                    options: preparedOptions,
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

    const handleAnswer = (option) => {
        if (showResult) return;

        setSelectedAnswer(option);
        setShowResult(true);

        if (option.isCorrect) {
            setScore(s => s + 1);
            addXp(20);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setShowResult(false);
            setSelectedAnswer(null);
        } else {
            setQuizComplete(true);
            addXp(50);
            if (score === questions.length) { // Check if perfect score
                unlockBadge('quiz_master');
            }
        }
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
                <p className="text-slate-400">Summoning characters...</p>
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
                    <h2 className="text-4xl font-bold text-white mb-4">Challenge Complete!</h2>
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
                    <User className="text-primary" /> Character Challenge
                </h1>
                <div className="bg-surface px-4 py-2 rounded-full text-primary font-bold">
                    {currentIndex + 1}/{questions.length}
                </div>
            </div>

            <div className="glass-card p-6 md:p-8">
                <div className="mb-8 rounded-2xl overflow-hidden h-64 md:h-80 bg-black/50 flex items-center justify-center">
                    <img
                        src={currentQuestion.image}
                        alt="Guess the character"
                        className="h-full object-contain"
                    />
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">
                    {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedAnswer?.id === option.id;

                        let buttonStyle = "bg-surface/50 hover:bg-surface text-slate-300";
                        if (showResult) {
                            if (option.isCorrect) buttonStyle = "bg-green-500 text-white border-green-400";
                            else if (isSelected) buttonStyle = "bg-red-500 text-white border-red-400";
                            else buttonStyle = "bg-surface/30 text-slate-500 opacity-50";
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleAnswer(option)}
                                disabled={showResult}
                                className={`p-4 rounded-xl text-left font-medium transition-all border border-transparent ${buttonStyle}`}
                            >
                                {option.text}
                            </button>
                        );
                    })}
                </div>

                {showResult && (
                    <div className="mt-8 text-center animate-fade-in">
                        <div className="mb-6">
                            {selectedAnswer?.isCorrect ? (
                                <div className="flex items-center justify-center gap-2 text-green-400 text-xl font-bold">
                                    <CheckCircle size={28} />
                                    <span>Correct!</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-red-400 text-xl font-bold">
                                        <XCircle size={28} />
                                        <span>It was {currentQuestion.correct.name}!</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20"
                        >
                            Next Character →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterQuiz;
