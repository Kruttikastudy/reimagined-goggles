'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone, Watch, Activity, RefreshCw,
    CheckCircle2, AlertCircle, BarChart3,
    Heart, Moon, Footprints, Zap
} from 'lucide-react';

export default function DevicesPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [connectedDevices, setConnectedDevices] = useState<string[]>(['apple', 'oura']);
    const [lastSync, setLastSync] = useState('Just now');

    const devices = [
        { id: 'apple', name: 'Apple Health', icon: '🍎', type: 'Mobile App', status: 'Connected' },
        { id: 'fitbit', name: 'Fitbit', icon: '⌚', type: 'Wearable', status: 'Disconnected' },
        { id: 'oura', name: 'Oura Ring', icon: '💍', type: 'Wearable', status: 'Connected' },
        { id: 'google', name: 'Google Fit', icon: '🤖', type: 'Mobile App', status: 'Disconnected' },
        { id: 'garmin', name: 'Garmin', icon: '🏃', type: 'Wearable', status: 'Disconnected' }
    ];

    const milestones = [
        { label: 'Weekly Steps', value: '42,500', unit: 'steps', icon: Footprints, color: 'bg-emerald-100 text-emerald-600', source: 'Apple Health' },
        { label: 'Avg Sleep', value: '7h 12m', unit: 'per night', icon: Moon, color: 'bg-indigo-100 text-indigo-600', source: 'Oura Ring' },
        { label: 'Resting HR', value: '62', unit: 'bpm', icon: Heart, color: 'bg-rose-100 text-rose-600', source: 'Apple Health' },
        { label: 'Active Energy', value: '2,100', unit: 'kcal', icon: Zap, color: 'bg-amber-100 text-amber-600', source: 'Oura Ring' }
    ];

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setLastSync('Just now');
        }, 2000);
    };

    const toggleDevice = (id: string) => {
        if (connectedDevices.includes(id)) {
            setConnectedDevices(connectedDevices.filter(d => d !== id));
        } else {
            setConnectedDevices([...connectedDevices, id]);
        }
    };

    return (
        <div className="min-h-full p-8 bg-slate-50 relative">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Connect Devices</h1>
                        <p className="text-slate-500 mt-1">Sync your health data from wearables and apps.</p>
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm disabled:opacity-70"
                    >
                        <RefreshCw size={18} className={isSyncing ? 'animate-spin text-blue-600' : ''} />
                        {isSyncing ? 'Syncing Data...' : 'Sync All Devices'}
                    </button>
                </div>

                {/* Sync Status Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 text-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">
                        Data last synced: <span className="font-bold">{lastSync}</span>.
                        All imported metrics are automatically updated in your Dashboard.
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Device Grid (Span 8) */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Smartphone size={20} className="text-slate-400" /> Available Sources
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {devices.map((device) => {
                                const isConnected = connectedDevices.includes(device.id);
                                return (
                                    <motion.div
                                        key={device.id}
                                        layout
                                        className={`p-5 rounded-2xl border transition-all ${isConnected
                                                ? 'bg-white border-blue-200 shadow-md shadow-blue-500/5'
                                                : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{device.icon}</span>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{device.name}</h3>
                                                    <p className="text-xs text-slate-500">{device.type}</p>
                                                </div>
                                            </div>
                                            {isConnected && (
                                                <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Active
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => toggleDevice(device.id)}
                                            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${isConnected
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            {isConnected ? 'Disconnect' : 'Connect'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Imported Milestones (Span 4) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BarChart3 size={20} className="text-slate-400" /> Imported Highlights
                        </h2>

                        <div className="space-y-4">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${milestone.color}`}>
                                        <milestone.icon size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{milestone.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold text-slate-900">{milestone.value}</span>
                                            <span className="text-xs text-slate-500">{milestone.unit}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                            via {milestone.source}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
                            <Activity className="mb-4 text-blue-400" size={32} />
                            <h3 className="text-lg font-bold mb-2">Smart Analysis</h3>
                            <p className="text-slate-300 text-sm mb-4">
                                Your Oura Ring data suggests you recover best when you sleep before 11 PM.
                            </p>
                            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                View Full Analysis <RefreshCw size={12} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
