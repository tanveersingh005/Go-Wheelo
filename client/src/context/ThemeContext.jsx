import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        // Instantly disable ALL transitions for the flash-free theme switch
        const root = document.documentElement;
        root.classList.add('no-transition');
        setTheme(prev => prev === "light" ? "dark" : "light");
        // Re-enable transitions after next paint
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                root.classList.remove('no-transition');
            });
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
