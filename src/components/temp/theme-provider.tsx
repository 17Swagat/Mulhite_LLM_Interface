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
        // React 19 onwards, do not require us to write <ThemeContext.Provider>
        <ThemeContext value={defaultTheme}>
            {children}
        </ThemeContext>
    )
}

export const useTheme = () => {
    return useContext(ThemeContext);
}