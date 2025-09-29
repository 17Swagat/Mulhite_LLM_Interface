'use client';
import {useContext, createContext} from 'react';

type Theme = {
    colors: {
        primary: string;
        secondary: string;
    }
}

const defaultTheme: Theme = {
    colors: {
        primary: '#0070f3', // blue
        secondary: '#1c1c1e' // dark gray
    }
}

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    return useContext(ThemeContext);
}