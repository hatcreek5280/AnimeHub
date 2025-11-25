import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass, Library, Trophy, User } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className="relative group">
        <div className={clsx(
            "flex flex-col items-center gap-1 p-2 transition-colors duration-300",
            active ? "text-white" : "text-slate-400 group-hover:text-primary"
        )}>
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
            {active && (
                <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-primary/20 blur-lg rounded-full -z-10"
                    transition={{ duration: 0.3 }}
                />
            )}
        </div>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/discovery', icon: Compass, label: 'Discovery' },
        { path: '/collection', icon: Library, label: 'Collection' },
        { path: '/quizzes', icon: Trophy, label: 'Quizzes' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="min-h-screen flex flex-col pb-20 md:pb-0">
            {/* Desktop Navigation */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display font-bold text-xl group-hover:scale-110 transition-transform">
                            AH
                        </div>
                        <span className="font-display text-2xl bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            ANIME HUB
                        </span>
                    </Link>

                    <div className="flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    location.pathname === item.path ? "text-white" : "text-slate-400"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                        />
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 pt-0 md:pt-20">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
