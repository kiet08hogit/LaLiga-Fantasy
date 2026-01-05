# La Liga Fantasy

A fantasy football application for La Liga (Spanish top football division) with interactive 3D visualization, live match statistics, and player data management. Built with Node.js backend, React frontend, and PostgreSQL database.

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React + Three.js (3D animations)
- **Styling**: SCSS with responsive design
- **Database**: PostgreSQL
- **External APIs**: RapidAPI Football API
- **Icons**: FontAwesome
- **Data Processing**: Python

## Project Structure

```
LaLiga-Fantasy/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── dreamteamController.js    # Dream team operations
│   │   │   ├── playerController.js       # Player data
│   │   │   ├── matchstatsController.js   # Match statistics
│   │   │   └── liveStatsController.js    # Live match stats (RapidAPI)
│   │   ├── routes/
│   │   │   ├── dreamteamRoutes.js
│   │   │   ├── playerRoutes.js
│   │   │   ├── matchRoutes.js
│   │   │   └── liveStatsRoutes.js        # Live stats endpoints
│   │   ├── db/
│   │   │   ├── pool.js                   # PostgreSQL connection pool
│   │   │   ├── schema.js                 # Database schema
│   │   │   ├── dreamteam.js
│   │   │   ├── matchstats.js
│   │   │   └── players.js
│   │   ├── middleware/                   # CORS and auth middleware
│   │   └── index.js                      # Server entry point
│   ├── teamdata/
│   │   ├── main.py                       # Data processing script
│   │   └── laliga_dataset/               # CSV data files
│   ├── .env                              # Environment variables
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedLetters/          # Text animation component
│   │   │   ├── DataHandling/             # Data processing utilities
│   │   │   ├── Home/                     # Homepage with ParticleBall
│   │   │   ├── Layout/                   # Layout wrapper with Sidebar
│   │   │   ├── LiveStats/                # Live match display (RapidAPI)
│   │   │   ├── MatchStats/               # Match filtering & stats
│   │   │   ├── ParticleBall/             # 3D confetti animation
│   │   │   ├── Position/                 # Player positions view
│   │   │   ├── Search/                   # Player search
│   │   │   ├── Sidebar/                  # Navigation sidebar (left vertical)
│   │   │   ├── TeamData/                 # Team player details
│   │   │   └── Teams/                    # Team directory
│   │   ├── data/
│   │   │   ├── nations.json              # Nation data
│   │   │   ├── positions.json            # Position data with images
│   │   │   └── teams.json                # Team data with logos
│   │   ├── assets/
│   │   │   └── images/                   # La Liga team logos and assets
│   │   ├── App.js                        # Main app component with routes
│   │   ├── App.css                       # App styles
│   │   ├── App.scss                      # App SCSS styles
│   │   ├── App.test.js                   # App tests
│   │   ├── index.js                      # Entry point
│   │   ├── index.css                     # Global styles
│   │   ├── logo.svg                      # Logo file
│   │   ├── reportWebVitals.js            # Performance reporting
│   │   └── setupTests.js                 # Test setup
│   ├── public/                           # Static assets
│   │   ├── index.html                    # HTML entry point
│   │   ├── manifest.json                 # PWA manifest
│   │   └── robots.txt                    # SEO robots file
│   └── package.json
│
├── venv311/                              # Python virtual environment
├── .gitignore
└── README.md
```

## Features

### ✨ Current Features
- **Interactive 3D ParticleBall** - Golden confetti animation with mouse repulsion effect on homepage
- **Live Match Statistics** - Real-time La Liga matches via RapidAPI Football API
- **Match Filtering** - Filter matches by team and date range with navigation to player stats
- **Team Directory** - Browse all La Liga teams with logos and details
- **Player Positions** - View players organized by position with images
- **Sidebar Navigation** - Vertical left sidebar with icon-based menu (Home, Teams, Match Stats, Positions, Trophy, Live Stats, Search)
- **Responsive Design** - Mobile-friendly layout with responsive navigation
- **Dream Team Management** - Create and manage custom team selections
- **Auto-refresh** - Live stats update every 30 seconds

### 🎯 In Development
- **TeamData Integration** - View player statistics by team and position
- **User Authentication** - User profiles and authentication
- **Player Search** - Advanced player search and filtering
- **League Standings** - Real-time La Liga standings

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Python 3.11+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your configuration:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=laliga_fantasy
   DB_PASSWORD=your_password
   DB_PORT=5432
   NODE_ENV=development
   RAPIDAPI_KEY=your_rapidapi_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`
   Database tables are created automatically on first run

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```
   App runs on `http://localhost:3000`

### Python Data Processing (Optional)

1. Navigate to data folder:
   ```bash
   cd backend/teamdata
   ```

2. Activate virtual environment:
   ```bash
   # Windows
   ..\..\venv311\Scripts\activate
   
   # macOS/Linux
   source ../../venv311/bin/activate
   ```

3. Run data processing:
   ```bash
   python main.py
   ```

## Configuration

### Environment Variables

**Backend (.env)**
```env
DB_USER=postgres              # PostgreSQL username
DB_HOST=localhost             # Database host
DB_NAME=laliga_fantasy        # Database name
DB_PASSWORD=your_password     # Database password
DB_PORT=5432                  # PostgreSQL port
NODE_ENV=development          # Environment
RAPIDAPI_KEY=your_key         # RapidAPI Football API key
```

### Color Scheme

- **Primary**: #001f3f (Deep Navy Blue)
- **Accent**: #8B6914 (Brown/Gold)
- **Gold**: #C4A747 (Confetti Color)

## API Endpoints

### Live Stats (RapidAPI Integration)
- `GET /live-stats/live` - Current live matches
- `GET /live-stats/standings` - La Liga standings
- `GET /live-stats/fixtures?round=X` - Fixtures by round

### Dream Teams
- `POST /dreamteam` - Create dream team
- `GET /dreamteam/:id` - Get team details
- `PUT /dreamteam/:id` - Update team
- `DELETE /dreamteam/:id` - Delete team

### Match Stats
- `GET /matches` - Get all matches
- `GET /matches/:team` - Get team matches
- `GET /matchstats` - Get statistics

### Players
- `GET /players` - Get all players
- `GET /players/:id` - Get player by ID
- `GET /players/team/:team` - Get players by team
- `GET /players/position/:position` - Get players by position

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
App runs on `http://localhost:3000`

## Key Components

### ParticleBall (Home Page)
- Interactive 3D confetti animation using Three.js
- 1200 particles with individual floating motion
- Mouse repulsion with smooth damping and spring physics
- Automatic rotation with responsive interaction
- Dimensions: 3-6px confetti pieces with scatter effect

### MatchStats (Filter & View)
- Team selection dropdown
- Date range filtering (All, Home, Away, Win, Loss, Draw)
- Navigates to TeamData with selected team and filter
- Real-time match display

### LiveStats (Live Matches)
- Auto-refreshes every 30 seconds
- Displays current La Liga matches
- Shows team names, scores, and match status
- RapidAPI Football API integration (LA_LIGA_ID = 140)
- Error handling for API failures

### Sidebar Navigation
- Vertical 100px-wide sidebar
- Icon-based navigation with FontAwesome icons
- Mobile-responsive hamburger menu
- Routes: Home, Teams, Match Stats, Position, Trophy, Live Stats, Search
- Smooth transitions and hover effects

## Database Schema

### Key Tables
- **players** - Player information and statistics
- **dream_teams** - User's custom team selections
- **dream_team_players** - Players in each dream team
- **match_stats** - Match results and statistics
- **teams** - La Liga team data

## Contributing

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add feature description"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```

4. Merge to main when ready:
   ```bash
   git checkout main
   git merge feature/your-feature
   ```

## Development Notes

- **Port Configuration**: Frontend (3000), Backend (5000)
- **RapidAPI**: Requires valid Football API key for live stats
- **Three.js**: Used for 3D particle animations with auto-refresh every 30 seconds
- **CORS**: Enabled for frontend-backend communication
- **Database**: Auto-initializes tables on first connection
- **Particle Physics**: Damping (0.92), Spring Force (0.08), Repulsion Radius (2.5)

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `.env` credentials are correct
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS is enabled in Express
- Ensure `localhost:5000` is accessible

### LiveStats shows no data
- Verify RAPIDAPI_KEY is set in `.env`
- Check RapidAPI Football API subscription is active
- Verify internet connection
- Check La Liga ID (140) is correct

### ParticleBall not showing animation
- Ensure Three.js is properly installed
- Check WebGL support in browser
- Verify GPU acceleration is enabled

## License

MIT

## Author

La Liga Fantasy Development Team
