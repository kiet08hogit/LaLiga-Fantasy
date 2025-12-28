# La Liga Fantasy

A fantasy football application for La Liga (Spanish top football division) built with Node.js backend, React frontend, and PostgreSQL database.

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React
- **Database**: PostgreSQL 15
- **Data Processing**: Python (pandas, BeautifulSoup)
- **Authentication**: JWT

## Project Structure

```
LaLiga-Fantasy/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Custom middleware
│   │   ├── db/                # Database queries
│   │   ├── models/            # Data models
│   │   └── index.js           # Server entry point
│   ├── teamdata/              # Python data processing
│   │   ├── main.py            # Consolidated data processing script
│   │   └── laliga_dataset/    # CSV data files
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Full page views
│   │   ├── services/          # API calls
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # State management
│   │   ├── styles/            # CSS stylesheets
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/                # Static assets
│   └── package.json
│
├── venv311/                   # Python virtual environment
├── .gitignore                 # Git ignore rules
└── README.md
```

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

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your PostgreSQL credentials

4. Create database tables:
   ```bash
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

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
   npm run dev
   ```
   App runs on `http://localhost:5173`

### Data Processing (Python)

1. Navigate to data folder:
   ```bash
   cd backend/teamdata
   ```

2. Activate virtual environment:
   ```bash
   source venv311/Scripts/activate  # Windows
   source venv311/bin/activate      # macOS/Linux
   ```

3. Run data processing:
   ```bash
   python main.py
   ```

## Database Schema

### Players Table
- `id` (SERIAL PRIMARY KEY)
- `player_name` (VARCHAR)
- `team` (VARCHAR)
- `position` (VARCHAR)
- `goals`, `assists`, `minutes` (INT)
- `expected_goals`, `expected_assists` (DECIMAL)
- And more stats...

### User Teams Table
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INT)
- `player_id` (INT - FK to players)

## API Endpoints

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `GET /api/players/team/:team` - Get players by team
- `GET /api/players/position/:position` - Get players by position

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:userId` - Get user's team

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Features (In Progress)

- [ ] User authentication & profiles
- [ ] Fantasy team creation & management
- [ ] Player statistics dashboard
- [ ] League standings
- [ ] Player comparison tools
- [ ] Weekly matchweek updates
- [ ] User rankings/leaderboard

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=laliga_fantasy
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key

NODE_ENV=development
PORT=5000
```

## Available Scripts

### Backend
- `npm start` - Run server
- `npm run dev` - Run with nodemon (auto-reload)
- `npm run migrate` - Run database migrations

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Data Processing

The `backend/teamdata/main.py` script provides:
1. **Fix date format** - Convert DD/MM/YY to MM/DD/YYYY
2. **Aggregate player stats** - Convert per-game stats to season totals
3. **View match data** - Display match information
4. **View player stats** - Show player statistics

Run `python main.py` for interactive menu.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## License

MIT

## Notes

- Database uses PostgreSQL 15
- CSV data files stored in `backend/teamdata/laliga_dataset/`
- Python virtual environment configured in `venv311/`
- All sensitive data (API keys, DB credentials) should be in `.env` files
