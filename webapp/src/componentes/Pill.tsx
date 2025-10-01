import React from "react";

export default function Pill({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs md:text-sm">
      {children}
    </span>
    );
}
