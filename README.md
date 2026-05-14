# La Liga Fantasy

A comprehensive fantasy football web application for La Liga featuring interactive analytics, lightning-fast team building, machine learning predictions, and rich player data management. Built with a TypeScript backend, React frontend, and a PostgreSQL database.

## Tech Stack

- **Frontend**: React, Three.js (3D animations), Shadcn UI, SCSS, Recharts
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (pg)
- **Machine Learning**: Python (FastAPI, Scikit-Learn) for real-time Match Predictions
- **Data Integration**: Futmind CDN for Player Cards
- **Development Tools**: tsx, nodemon, concurrently

## Key Features

- **Dream Team Builder**
  - Build your ultimate La Liga starting XI with tactical formations (4-3-3, 4-4-2, 3-5-2, etc.).
  - Lightning-fast drag-and-drop experience using browser caching (`localStorage`)—no accounts or registration required to start drafting your team.
  - Pulls high-quality player card imagery directly from the Futmind CDN for an authentic FUT-style experience.
  - Automatically handles fallbacks for players without official cards.

- **Analytics Dashboards & Match Data**
  - Interactive data visualization using Shadcn UI charts (e.g. Radar charts for Season MVP).
  - Real-time match statistics, player performance trends, and dynamic filtering.
  - Powered by a robust local PostgreSQL database containing comprehensive 2024/2025 La Liga datasets.

- **Machine Learning Predictions**
  - Built-in Random Forest predictive model served via a Python FastAPI server.
  - Predicts live match outcomes and goal differentials based on historical La Liga data.
  - Integrated directly into the LiveStats dashboard for seamless viewing.

- **Interactive 3D UI**
  - Features 'ParticleBall', a golden confetti animation with mouse-repulsion physics on the homepage using Three.js.
  - Custom SCSS animations for a premium, sleek dark-mode aesthetic.

## Project Structure

```text
LaLiga-Fantasy/
├── backend/                    # TypeScript Node.js API server
│   ├── src/
│   │   ├── controllers/        # Express route controllers
│   │   ├── db/                 # PostgreSQL queries and connection pool
│   │   ├── routes/             # API endpoints
│   │   ├── types/              # TypeScript definitions
│   │   ├── utils/              # Data mappers
│   │   └── index.ts            # Server entry point
│   ├── teamdata/               # SQL datasets (playerstats & matches)
│   └── .env                    # Environment variables
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # React components (DreamTeam, LiveStats, Teams, etc.)
│   │   ├── data/               # Static JSON maps (e.g., playerResourceIds.json)
│   │   └── assets/             # Images and styles
│   └── package.json
├── LaligaPrediction/           # Python Machine Learning module
│   ├── prediction.py           # FastAPI Server & Random Forest model
│   └── season-2122.csv         # Historical training dataset
├── package.json                # Root package containing concurrent start scripts
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Python 3.11+ (Make sure "Add Python.exe to PATH" is checked during installation)

### Database Setup
1. Create a PostgreSQL database named `LaLiga Fantasy`. 
2. Import the SQL datasets found in `backend/teamdata/laliga_dataset/` to set up your `playerstats_24_25` and `laliga_matches_24_25` tables using pgAdmin or the command line.

### Environment Variables
Create a `.env` file in the `backend/` directory:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME="LaLiga Fantasy"
DB_PORT=5432
DB_HOST=localhost
```

### Installation
1. Install root dependencies (which manages the concurrently package):
   ```bash
   npm install
   ```
2. Install frontend and backend dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Install Python Machine Learning dependencies:
   ```bash
   cd ../LaligaPrediction
   python -m pip install pandas scikit-learn fastapi uvicorn pydantic joblib
   ```

### Running the Application
Return to the root `LaLiga-Fantasy` folder and run:
```bash
npm run dev
```
This single command uses `concurrently` to automatically start all three services simultaneously:
- **React Frontend** (Port 3000)
- **Express Backend** (Port 5000)
- **FastAPI ML Server** (Port 8000)

## API Endpoints
- **Players**: `/players` (Fetch all), `/players/name/:name` (Partial name search)
- **Matches**: `/matches`
- **Live Stats**: `/live-stats`

## License
MIT
