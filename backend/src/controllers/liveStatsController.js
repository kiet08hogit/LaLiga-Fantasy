import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';
const LA_LIGA_ID = 140; // La Liga league ID in API-Football

const axiosInstance = axios.create({
    baseURL: `https://${RAPIDAPI_HOST}`,
    headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
    }
});

// Get live matches
export const getLiveMatches = async (req, res) => {
    try {
        const response = await axiosInstance.get('/fixtures', {
            params: {
                league: LA_LIGA_ID,
                season: 2024,
                status: 'LIVE'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching live matches:', error.message);
        res.status(500).json({ error: 'Failed to fetch live matches' });
    }
};

// Get league standings
export const getStandings = async (req, res) => {
    try {
        const response = await axiosInstance.get('/standings', {
            params: {
                league: LA_LIGA_ID,
                season: 2024
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching standings:', error.message);
        res.status(500).json({ error: 'Failed to fetch standings' });
    }
};

// Get fixtures for a specific matchweek
export const getFixtures = async (req, res) => {
    try {
        const { round } = req.query;
        
        const params = {
            league: LA_LIGA_ID,
            season: 2024
        };

        if (round) {
            params.round = round;
        }

        const response = await axiosInstance.get('/fixtures', { params });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching fixtures:', error.message);
        res.status(500).json({ error: 'Failed to fetch fixtures' });
    }
};
