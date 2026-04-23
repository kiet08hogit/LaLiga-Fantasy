import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import "./index.scss";
import AnimatedLetters from "../AnimatedLetters";

const Search = () => {
    const navigate = useNavigate();
    const [letterClass, setLetterClass] = useState('text-animate');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass("text-animate-hover");
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    }, []);

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/data?name=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container search-page">
            <div className="search-content">
                <h1 className="page-title">
                    <AnimatedLetters letterClass={letterClass} strArray={"Search".split("")} idx={15} />
                </h1>
                <p className="search-subtitle">Find players across all La Liga teams</p>

                <div className="search-input-wrapper">
                    <div className="relative">
                        <SearchIcon
                            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                        />
                        <Input
                            className="search-field bg-background pl-12 h-14 text-lg"
                            id="search-input"
                            placeholder="Search for players..."
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                        />
                    </div>
                    <button
                        className="search-go-btn"
                        onClick={handleSearch}
                        disabled={!searchQuery.trim()}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Search;
