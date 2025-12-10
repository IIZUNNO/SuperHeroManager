// frontend/src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Rechercher un héros par nom, alias ou pouvoir..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
            />
            {searchQuery && (
                <button 
                    onClick={() => onSearchChange('')}
                    className="clear-search"
                    aria-label="Effacer la recherche"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default SearchBar;