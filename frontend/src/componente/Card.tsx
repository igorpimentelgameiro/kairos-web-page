import React from "react";

export default function Card({children, className = ""}: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-2xl shadow-sm border bg-card text-card-foreground ${className}`}>{children}</div>;
}
