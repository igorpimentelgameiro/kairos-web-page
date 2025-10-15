import React from "react";
import {motion} from "framer-motion";

export default function Section({
                                    title,
                                    subtitle,
                                    children,
                                }: {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}) {
    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.4}}>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
                {subtitle && <p className="mt-2 text-muted-foreground max-w-3xl">{subtitle}</p>}
                <div className="mt-6">{children}</div>
            </motion.div>
        </section>
    );
}
