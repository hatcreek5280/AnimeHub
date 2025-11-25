import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const LEVELS = [
    { level: 1, xp: 0, title: 'Novice Watcher' },
    { level: 5, xp: 500, title: 'Anime Fan' },
    { level: 10, xp: 2000, title: 'Otaku' },
    { level: 20, xp: 5000, title: 'Super Otaku' },
    { level: 50, xp: 20000, title: 'Anime God' },
];

const BADGES = [
    { id: 'first_anime', name: 'First Step', description: 'Add your first anime to collection', icon: '🌱' },
    { id: 'quiz_master', name: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🎓' },
    { id: 'collector_10', name: 'Collector', description: 'Collect 10 anime', icon: '📚' },
    { id: 'genre_explorer', name: 'Genre Explorer', description: 'Watch anime from 5 different genres', icon: '🌍' },
];

export const useGamificationStore = create(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            title: 'Novice Watcher',
            badges: [],
            collection: [],

            addXp: (amount) => {
                const { xp, level } = get();
                const newXp = xp + amount;

                // Check for level up
                const nextLevel = LEVELS.slice().reverse().find(l => newXp >= l.xp);
                const newLevel = nextLevel ? nextLevel.level : level;
                const newTitle = nextLevel ? nextLevel.title : get().title;

                set({ xp: newXp, level: newLevel, title: newTitle });

                if (newLevel > level) {
                    return { leveledUp: true, newLevel, newTitle };
                }
                return { leveledUp: false };
            },

            unlockBadge: (badgeId) => {
                const { badges } = get();
                if (!badges.includes(badgeId)) {
                    set({ badges: [...badges, badgeId] });
                    get().addXp(100); // Bonus XP for badge
                    return true; // Badge unlocked
                }
                return false;
            },

            addToCollection: (anime) => {
                const { collection } = get();
                if (!collection.find(a => a.mal_id === anime.mal_id)) {
                    set({ collection: [...collection, { ...anime, addedAt: Date.now(), status: 'plan_to_watch' }] });
                    get().addXp(10);

                    if (collection.length === 0) get().unlockBadge('first_anime');
                    if (collection.length === 9) get().unlockBadge('collector_10');
                }
            },

            removeFromCollection: (malId) => {
                set({ collection: get().collection.filter(a => a.mal_id !== malId) });
            },

            updateAnimeStatus: (malId, status) => {
                set({
                    collection: get().collection.map(a =>
                        a.mal_id === malId ? { ...a, status } : a
                    )
                });
            }
        }),
        {
            name: 'anime-hub-storage',
        }
    )
);
