import React, { createContext } from 'react';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ThemeContext.Provider;