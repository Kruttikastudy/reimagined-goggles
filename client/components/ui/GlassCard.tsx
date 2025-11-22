import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6 transition-all duration-300",
                hoverEffect && "hover:scale-[1.02] hover:shadow-neon-blue/50",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
