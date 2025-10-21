import {useEffect, useState} from "react";

export default function useDarkMode() {
    const [enabled, setEnabled] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (enabled) root.classList.add("dark");
        else root.classList.remove("dark");
    }, [enabled]);

    return {enabled, setEnabled};
}
