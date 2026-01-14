import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function StatsCard({ label, value, icon: Icon, trend, colorClass }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group"
        >
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 transition-all duration-500 group-hover:scale-150", colorClass)} />

            <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", colorClass, "bg-opacity-10")}>
                    <Icon className={cn("w-6 h-6", colorClass.replace('bg-', 'text-'))} />
                </div>
                {trend && (
                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trend > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>

            <div>
                <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
        </motion.div>
    );
}
