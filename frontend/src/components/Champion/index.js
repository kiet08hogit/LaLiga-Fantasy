import { useEffect, useState } from 'react';
import Loader from 'react-loaders';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import './index.scss';
import RaphinhaRed from '../../assets/images/Raphina_in_red.png';
import RaphinhaBarca from '../../assets/images/Raphinha-barca.png';
const chartConfig = {
    value: {
        label: "Metric",
        color: "#eab308",
    },
};

// Clamp helper
const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

// Each section occupies 100vh of scroll space.
// Sections: 0=Hero, 1=Barca Jersey, 2=Red Picture, 3=MVP
// Total = 4 sections × 100vh + extra = 500vh
const SECTION_HEIGHT = 1400; // px of scroll per section — more room = more dwell time

const Champion = () => {
    const [scrollY, setScrollY] = useState(0);
    const [mvpData, setMvpData] = useState([]);
    useEffect(() => {
        window.scrollTo(0, 0);

        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });

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

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- Curtain slide logic ---
    // Section 0 (Hero): visible from 0, slides OUT upward as section 1 comes in
    // Section N slides IN from bottom: translateY goes 100% → 0% during scroll window [N*SH - SH, N*SH]
    // Each section then stays at translateY(0) until next section slides over it.

    const getSlideY = (sectionIndex) => {
        const enter = sectionIndex * SECTION_HEIGHT;      // scroll position where slide starts
        const enterEnd = enter + SECTION_HEIGHT * 0.4;    // faster slide-in = more dwell time on screen
        if (scrollY < enter) return 100;                  // fully below viewport
        if (scrollY >= enterEnd) return 0;                // fully in view
        return 100 - (clamp(scrollY - enter, 0, enterEnd - enter) / (enterEnd - enter)) * 100;
    };

    // Hero fades out slightly as section 1 slides in (parallax feel)
    const heroOpacity = clamp(1 - (scrollY / SECTION_HEIGHT) * 1.2, 0, 1);
    const heroScale = clamp(1 - (scrollY / SECTION_HEIGHT) * 0.06, 0.94, 1);

    // Sections slide in from bottom
    const slide1Y = getSlideY(1); // Barca Jersey
    const slide2Y = getSlideY(2); // Red Picture
    const slide3Y = getSlideY(3); // MVP

    // Subtle parallax scale on images as they stay on screen
    const pic2Scale = 1 + clamp((scrollY - SECTION_HEIGHT) / 8000, 0, 0.04);
    const pic1Scale = 1 + clamp((scrollY - SECTION_HEIGHT * 2) / 8000, 0, 0.04);

    const totalHeight = `${SECTION_HEIGHT * 4 + 400}px`;

    return (
        <>
            <div className="container champion-page" style={{ height: totalHeight, paddingBottom: 0 }}>
                {/* Sticky Container with rounded border */}
                <div style={{
                    position: 'sticky', top: 0, left: 0,
                    width: '100%', height: '100vh',
                    overflow: 'hidden', borderRadius: '25px',
                }}>
                    {/* Grain texture overlay — sits on top of everything */}
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 100,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                        opacity: 0.04,
                        pointerEvents: 'none',
                    }} />

                    {/* ── SECTION 0: Hero Banner ── */}
                    <div
                        className="champion-hero"
                        style={{
                            position: 'absolute', inset: 0,
                            opacity: heroOpacity,
                            transform: `scale(${heroScale})`,
                            transformOrigin: 'center top',
                            transition: 'none',
                            zIndex: 1,
                        }}
                    >
                        <div className="hero-overlay">
                            <img src="/barca20242025.webp" alt="FC Barcelona Champion" className="hero-image" />
                            <div className="hero-sponsors">
                                <img src="/nike-logo.png" alt="Nike" className="sponsor-logo" />
                                <img src="/Spotify_logo_without_text.svg.png" alt="Spotify" className="sponsor-logo" />
                            </div>
                            <div className="hero-logo">
                                <img src="/teams/FC_Barcelona_(crest).svg" alt="Barcelona Logo" className="logo-image" />
                            </div>
                            <div className="hero-content">
                                <h1 className="hero-title-line1">¡Vamos, Barça!</h1>
                                <p className="hero-title-line2">Campeones de La Liga.</p>
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 1: Barca Jersey — slides up from bottom ── */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: '#04193a',
                        transform: `translateY(${slide1Y}%)`,
                        transition: 'none',
                        zIndex: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
                        {/* Large parallax background text */}
                        <span style={{
                            position: 'absolute',
                            fontSize: '20vw', fontWeight: 900,
                            color: 'rgba(163,0,0,0.18)',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            userSelect: 'none', whiteSpace: 'nowrap',
                            transform: `translateY(${-slide1Y * 0.3}%)`,
                            zIndex: 1,
                            fontFamily: 'Impact, sans-serif',
                        }}>FC BARCELONA</span>
                        {/* Centered jersey image */}
                        <img
                            src={RaphinhaBarca}
                            alt="Raphinha Barca Jersey"
                            style={{
                                position: 'relative', zIndex: 2,
                                maxHeight: '88vh', maxWidth: '90%',
                                objectFit: 'contain',
                                transform: `scale(${pic2Scale})`,
                                transformOrigin: 'center center',
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))',
                            }}
                        />
                        {/* Bottom label */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '32px 60px',
                            background: 'linear-gradient(to top, rgba(4,25,58,0.95) 0%, transparent 100%)',
                            zIndex: 3,
                        }}>
                            <span style={{ color: '#eab308', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '12px', display: 'block', marginBottom: '6px' }}>A New Era</span>
                            <h2 style={{ color: '#fff', fontSize: '4rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>Blaugrana</h2>
                        </div>
                    </div>

                    {/* ── SECTION 2: Red Raphinha — slides up from bottom ── */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: '#0d0000',
                        transform: `translateY(${slide2Y}%)`,
                        transition: 'none',
                        zIndex: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                    }}>
                        {/* Large parallax background text */}
                        <span style={{
                            position: 'absolute',
                            fontSize: '20vw', fontWeight: 900,
                            color: 'rgba(200,0,0,0.1)',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                            userSelect: 'none', whiteSpace: 'nowrap',
                            transform: `translateY(${-slide2Y * 0.3}%)`,
                            zIndex: 1,
                            fontFamily: 'Impact, sans-serif',
                        }}>EL MAGO</span>
                        {/* Full image */}
                        <img
                            src={RaphinhaRed}
                            alt="Raphinha in Red"
                            style={{
                                position: 'relative', zIndex: 2,
                                maxHeight: '88vh', maxWidth: '90%',
                                objectFit: 'contain',
                                transform: `scale(${pic1Scale})`,
                                transformOrigin: 'center center',
                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8))',
                            }}
                        />
                        {/* Bottom label */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '32px 60px',
                            background: 'linear-gradient(to top, rgba(13,0,0,0.95) 0%, transparent 100%)',
                            zIndex: 3,
                        }}>
                            <span style={{ color: '#eab308', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: '12px', display: 'block', marginBottom: '6px' }}>The Magic Begins</span>
                            <h2 style={{ color: '#fff', fontSize: '4rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>El Mago</h2>
                        </div>
                    </div>

                    {/* ── SECTION 3: Season Summary — slides up from bottom ── */}
                    <div
                        className="mvp-section"
                        style={{
                            position: 'absolute', inset: 0,
                            margin: 0, borderRadius: 0,
                            transform: `translateY(${slide3Y}%)`,
                            transition: 'none',
                            zIndex: 30,
                            pointerEvents: slide3Y < 50 ? 'auto' : 'none',
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
                                                    dot={{ r: 4, fillOpacity: 1 }}
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

                </div> {/* End Sticky Container */}
            </div>
            <Loader type="pacman" />
        </>
    );
};

export default Champion;
