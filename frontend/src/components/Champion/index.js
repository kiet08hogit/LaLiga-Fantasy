import { useEffect, useState } from 'react';
import Loader from 'react-loaders';
import './index.scss';
import AnimatedLetters from '../AnimatedLetters';

const Champion = () => {
    const [letterClass, setLetterClass] = useState('text-animate');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        const timerId = setTimeout(() => {
            setLetterClass('text-animate-hover');
        }, 3000);

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timerId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    // Calculate opacity and transform for scroll animations
    const heroOpacity = Math.max(0, 1 - scrollY / 600);
    const heroScale = Math.max(0.95, 1 - scrollY / 3000);
    
    const mvpOpacity = Math.min(1, Math.max(0, (scrollY - 400) / 600));
    const mvpTranslateY = Math.max(0, 50 - (scrollY - 400) / 10);

    return (
        <>
            <div className="container champion-page">
                {/* Hero Banner Section */}
                <div 
                    className="champion-hero" 
                    style={{ 
                        opacity: heroOpacity,
                        transform: `scale(${heroScale})`
                    }}
                >
                    <div className="hero-overlay">
                        <img src="/barca20242025.webp" alt="FC Barcelona Champion" className="hero-image" />
                        
                        {/* Top Left - Sponsors with white background */}
                        <div className="hero-sponsors">
                            <img src="/nike-logo.png" alt="Nike" className="sponsor-logo" />
                            <img src="/Spotify_logo_without_text.svg.png" alt="Spotify" className="sponsor-logo" />
                        </div>

                        {/* Center - Logo (smaller) */}
                        <div className="hero-logo">
                            <img src="/teams/FC_Barcelona_(crest).svg" alt="Barcelona Logo" className="logo-image" />
                        </div>

                        {/* Center Content - Text */}
                        <div className="hero-content">
                            <h1 className="hero-title-line1">¡Vamos, Barça!</h1>
                            <p className="hero-title-line2">ACampeones de La Liga.</p>
                        </div>
                    </div>
                </div>

                {/* MVP Section */}
                <div 
                    className="mvp-section"
                    style={{
                        opacity: mvpOpacity,
                        transform: `translateY(${mvpTranslateY}px)`
                    }}
                >
                    <div className='middle'><h3>Season Summary</h3></div>
                    <div className="mvp-content">
                        <div className="mvp-left-side" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/raphinamvp.webp)` }}>
                            <span className="mvp-label">Season MVP</span>
                            <h2 className="mvp-name">Raphinha</h2>
                            <p className="mvp-team">FC Barcelona</p>
                        </div>
                        <div className="mvp-right-side">
                        <div className="mvp-stats-card">
                            <h3 className="stats-title">2024/25 Season Stats</h3>
                            <div className="stats-list">
                                <div className="stat-item">
                                    <span className="stat-label">Goals</span>
                                    <span className="stat-value">15</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Assists</span>
                                    <span className="stat-value">10</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Matches</span>
                                    <span className="stat-value">38</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <Loader type="pacman" />
        </>
    );
};

export default Champion;
