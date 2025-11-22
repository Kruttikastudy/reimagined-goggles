import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'blue' | 'purple' | 'green' | 'pink';
    fullWidth?: boolean;
}

export function NeonButton({ children, className, variant = 'blue', fullWidth = false, ...props }: NeonButtonProps) {
    const variants = {
        blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
        purple: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200",
        green: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200",
        pink: "bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-200",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "px-6 py-3 rounded-xl font-semibold transition-all duration-300",
                variants[variant],
                fullWidth && "w-full",
                className
            )}
            onClick={props.onClick}
            disabled={props.disabled}
            type={props.type}
        >
            {children}
        </motion.button>
    );
}
