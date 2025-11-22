'use client';

import { motion } from 'framer-motion';
import {
    Trophy, Medal, Flame, Users, Star,
    TrendingUp, Crown, Zap, Target, Heart
} from 'lucide-react';

export default function CommunityPage() {
    const badges = [
        { name: 'Early Riser', icon: '🌅', date: 'Oct 2024', color: 'bg-amber-100 text-amber-600' },
        { name: 'Hydration Hero', icon: '💧', date: 'Nov 2024', color: 'bg-blue-100 text-blue-600' },
        { name: 'Step Master', icon: '👟', date: 'Nov 2024', color: 'bg-emerald-100 text-emerald-600' },
        { name: 'Zen Master', icon: '🧘', date: 'Sep 2024', color: 'bg-purple-100 text-purple-600' },
        { name: 'Clean Eater', icon: '🥗', date: 'Aug 2024', color: 'bg-green-100 text-green-600' }
    ];

    const challenges = [
        { title: '10k Steps Daily', participants: '12.5k', daysLeft: 5, color: 'from-blue-500 to-cyan-500', icon: Target },
        { title: 'Sugar-Free Week', participants: '8.2k', daysLeft: 2, color: 'from-rose-500 to-pink-500', icon: Heart },
        { title: 'Meditation Month', participants: '5.1k', daysLeft: 12, color: 'from-violet-500 to-purple-500', icon: Zap }
    ];

    const fitfluencers = [
        { name: 'Dr. Fit', role: 'Cardio Expert', followers: '1.2M', image: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Yoga with Sarah', role: 'Mindfulness', followers: '850k', image: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Muscle Mike', role: 'Strength Coach', followers: '2.1M', image: 'https://i.pravatar.cc/150?img=3' }
    ];

    const leaderboard = [
        { rank: 1, name: 'FitNinja', points: 12500, badges: 15, challenges: 42, followers: 120, avatar: '🥷' },
        { rank: 2, name: 'DietingDuck', points: 11800, badges: 12, challenges: 38, followers: 95, avatar: '🦆' },
        { rank: 3, name: 'HealthWarrior', points: 11200, badges: 14, challenges: 35, followers: 110, avatar: '⚔️' },
        { rank: 4, name: 'ZenPanda', points: 10500, badges: 10, challenges: 30, followers: 80, avatar: '🐼' },
        { rank: 5, name: 'RunningRabbit', points: 9800, badges: 8, challenges: 28, followers: 65, avatar: '🐰' },
    ];

    return (
        <div className="min-h-full p-8 bg-slate-50 relative">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Community Challenges</h1>
                    <p className="text-slate-500 mt-1">Compete, earn badges, and get inspired by Fit-fluencers!</p>
                </div>

                {/* Hall of Fame Badges */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Trophy className="text-amber-500" size={24} />
                        <h2 className="text-lg font-bold text-slate-900">Your Trophy Case</h2>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {badges.map((badge, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl ${badge.color} cursor-help relative group`}
                            >
                                <span className="text-3xl mb-1">{badge.icon}</span>
                                <span className="text-xs font-bold text-center leading-tight px-1">{badge.name}</span>

                                {/* Hover Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Achieved: {badge.date}
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </div>
                            </motion.div>
                        ))}
                        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                            <span className="text-2xl opacity-50">🔒</span>
                            <span className="text-xs font-medium mt-1">Next Badge</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Trending Challenges (Span 8) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Flame className="text-rose-500" size={24} />
                                <h2 className="text-lg font-bold text-slate-900">Trending Challenges</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {challenges.map((challenge, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className={`p-5 rounded-2xl bg-gradient-to-br ${challenge.color} text-white relative overflow-hidden group cursor-pointer`}
                                    >
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                                        <challenge.icon className="mb-3 text-white/90" size={24} />
                                        <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
                                        <p className="text-white/80 text-xs mb-4">{challenge.participants} joined • {challenge.daysLeft} days left</p>
                                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-bold transition-colors">
                                            Join Now
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <Crown className="text-amber-500" size={24} />
                                    <h2 className="text-lg font-bold text-slate-900">Global Leaderboard</h2>
                                </div>
                                <div className="text-sm text-slate-500">
                                    Your Rank: <span className="font-bold text-slate-900">#42</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {leaderboard.map((user, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${index < 3 ? 'bg-slate-50 border border-slate-100' : 'hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${index === 0 ? 'bg-amber-100 text-amber-600' :
                                                index === 1 ? 'bg-slate-200 text-slate-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                        'text-slate-400'
                                            }`}>
                                            {user.rank}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                                            {user.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900">{user.name}</h4>
                                            <div className="flex gap-3 text-xs text-slate-500 mt-0.5">
                                                <span className="flex items-center gap-1"><Medal size={12} /> {user.badges} Badges</span>
                                                <span className="flex items-center gap-1"><Target size={12} /> {user.challenges} Challenges</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-blue-600">{user.points.toLocaleString()}</p>
                                            <p className="text-xs text-slate-400">points</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Fit-fluencers (Span 4) */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Star className="text-purple-500" size={24} />
                                <h2 className="text-lg font-bold text-slate-900">Top Fit-fluencers</h2>
                            </div>
                            <div className="space-y-4">
                                {fitfluencers.map((influencer, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-purple-50 transition-colors group cursor-pointer">
                                        <img src={influencer.image} alt={influencer.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900">{influencer.name}</h4>
                                            <p className="text-xs text-purple-600">{influencer.role}</p>
                                        </div>
                                        <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                                View All Champions
                            </button>
                        </div>

                        {/* Motivation Card */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
                            <TrendingUp className="mb-4 text-emerald-100" size={32} />
                            <h3 className="text-xl font-bold mb-2">Keep it up!</h3>
                            <p className="text-emerald-100 text-sm mb-4">You're in the top 10% of active users this week. Join one more challenge to reach the next tier!</p>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white/90 w-[85%] rounded-full" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
