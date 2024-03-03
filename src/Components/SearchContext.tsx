import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface SearchContextProps {
  children: ReactNode;
}

interface SearchContextValue {
  searchHistory: string[];
  addToSearchHistory: (term: string) => void;
}

const SEARCH_HISTORY_KEY = 'searchHistory';

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider: React.FC<SearchContextProps> = ({ children }) => {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const addToSearchHistory = (term: string) => {
    setSearchHistory((prevHistory) => [...prevHistory, term]);
  };

  useEffect(() => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  const value: SearchContextValue = {
    searchHistory,
    addToSearchHistory,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
