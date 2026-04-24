import { useEffect, useState } from 'react';
import Loader from 'react-loaders';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import './index.scss';
import AnimatedLetters from '../AnimatedLetters';

const chartConfig = {
  value: {
    label: "Metric",
    color: "#eab308", // Golden yellow
  },
};

const Champion = () => {
    const [letterClass, setLetterClass] = useState('text-animate');
    const [scrollY, setScrollY] = useState(0);
    const [mvpData, setMvpData] = useState([]);

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

        const fetchMvp = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/players/name/Raphinha`);
                const p = res.data;
                const totalXg = p.expected_goals * (p.minutes_played / 90);
                const totalXag = p.expected_assists * (p.minutes_played / 90);
                
                setMvpData([
                    { metric: "Goals", value: Number(p.goals || 0) },
                    { metric: "Assists", value: Number(p.assists || 0) },
                    { metric: "Total xG", value: Number(totalXg.toFixed(1)) },
                    { metric: "Total xAG", value: Number(totalXag.toFixed(1)) },
                    { metric: "Matches", value: Number(p.matches_played || 0) },
                ]);
            } catch (err) {
                console.error('Error fetching MVP data', err);
            }
        };
        fetchMvp();

        return () => {
            clearTimeout(timerId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Calculate opacity and transform for scroll animations
    const heroOpacity = Math.max(0, 1 - scrollY / 600);
    const heroScale = Math.max(0.95, 1 - scrollY / 3000);
    
    // Smooth fade in starting slightly later
    const mvpOpacity = scrollY > 200 ? Math.min(1, Math.max(0, (scrollY - 200) / 400)) : 0;
    // Translate Y slides up gently
    const mvpTranslateY = scrollY > 200 ? Math.max(0, 50 - ((scrollY - 200) / 8)) : 50;

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

                        {/* Center - Logo */}
                        <div className="hero-logo">
                            <img src="/teams/FC_Barcelona_(crest).svg" alt="Barcelona Logo" className="logo-image" />
                        </div>

                        {/* Center Content - Text */}
                        <div className="hero-content">
                            <h1 className="hero-title-line1">¡Vamos, Barça!</h1>
                            <p className="hero-title-line2">Campeones de La Liga.</p>
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
                        <div className="mvp-right-side flex items-center justify-center p-4">
                            {mvpData.length > 0 ? (
                                <div className="w-full max-w-lg bg-black/30 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)] mt-8">
                                    <h3 className="text-xl font-bold text-yellow-500 mb-6 text-center uppercase tracking-wider">
                                        Performance Profile
                                    </h3>
                                    <ChartContainer config={chartConfig} className="mx-auto aspect-[1.2] w-full">
                                        <RadarChart data={mvpData}>
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                            <PolarGrid stroke="rgba(255,255,255,0.15)" />
                                            <PolarAngleAxis 
                                                dataKey="metric" 
                                                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }} 
                                            />
                                            <Radar
                                                dataKey="value"
                                                fill="var(--color-value)"
                                                fillOpacity={0.6}
                                                stroke="var(--color-value)"
                                                strokeWidth={3}
                                                dot={{
                                                    r: 4,
                                                    fillOpacity: 1,
                                                }}
                                            />
                                        </RadarChart>
                                    </ChartContainer>
                                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                                        {mvpData.map((stat, idx) => (
                                            <div key={idx} className="flex flex-col items-center bg-white/5 rounded-lg border border-white/10 px-4 py-2 min-w-[80px]">
                                                <span className="text-xl font-bold text-yellow-400">{stat.value}</span>
                                                <span className="text-[10px] text-white/60 uppercase tracking-wider mt-1">{stat.metric}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-white/50">
                                    Loading Stats...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Loader type="pacman" />
        </>
    );
};

export default Champion;
