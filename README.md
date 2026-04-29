# La Liga Fantasy

A comprehensive fantasy football web application for La Liga featuring interactive analytics, team building, machine learning predictions, and player data management. Built with a TypeScript backend, React frontend, and a PostgreSQL database.

## Tech Stack

- **Frontend**: React, Three.js (3D animations), Shadcn UI, SCSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Machine Learning**: Python (Random Forest model) for Match Prediction
- **Data Integration**: Futmind CDN for Player Cards
- **Authentication**: JWT (JSON Web Tokens)
- **Development Tools**: tsx, nodemon

## Key Features

- **Dream Team Builder**
  - Build your ultimate La Liga starting XI with tactical formations (4-3-3, 4-4-2, etc.).
  - Pulls high-quality player card imagery directly from the Futmind CDN for an authentic FUT-style experience.
  - Automatically handles fallbacks for players without official cards.

- **Analytics Dashboards & Match Data**
  - Interactive data visualization using Shadcn UI charts.
  - Real-time match statistics, player performance trends, and dynamic filtering.
  - Removed dependency on third-party APIs like RapidAPI in favor of a robust local PostgreSQL database.

- **Machine Learning Predictions**
  - Built-in Random Forest model written in Python.
  - Predicts match outcomes based on historical La Liga data.

- **Interactive 3D UI**
  - Features 'ParticleBall', a golden confetti animation with mouse-repulsion physics on the homepage using Three.js.
  - Custom SCSS animations for a premium, sleek dark-mode aesthetic.

- **User Authentication**
  - Secure registration and login using bcrypt and JWT.
  - Save and manage custom Dream Teams linked to your user profile.

## Project Structure

```
LaLiga-Fantasy/
├── backend/                    # TypeScript Node.js API server
│   ├── src/
│   │   ├── auth/               # JWT authentication logic
│   │   ├── controllers/        # Express route controllers
│   │   ├── db/                 # PostgreSQL queries and schema
│   │   ├── routes/             # API endpoints
│   │   ├── types/              # TypeScript definitions
│   │   └── index.ts            # Server entry point
│   └── .env                    # Environment variables
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/         # React components (DreamTeam, LiveStats, Teams, ui, etc.)
│   │   ├── data/               # Static JSON maps (e.g., playerResourceIds.json)
│   │   └── assets/             # Images and styles
│   └── package.json
├── LaligaPrediction/           # Python Machine Learning module
│   ├── prediction.py           # Random Forest training & evaluation
│   └── season-2122.csv         # Historical dataset
├── card_scraper/               # Python utility scripts
│   └── build_resource_map.py   # Script to map DB players to Futmind CDN IDs
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Python 3.11+
- npm or yarn

### Database Setup

Create a PostgreSQL database named `laliga_fantasy`. The application will automatically initialize the required tables (`users`, `dream_teams`, `dream_team_players`, `players`, `match_stats`, etc.) when the backend server starts.

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=laliga_fantasy
   DB_PASSWORD=your_password
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

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

### Python Machine Learning Setup (Optional)

1. Navigate to the prediction directory:
   ```bash
   cd LaligaPrediction
   ```

2. Install requirements (pandas, scikit-learn):
   ```bash
   pip install pandas scikit-learn
   ```

3. Run the prediction model:
   ```bash
   python prediction.py
   ```

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Dream Team**: `/api/dreamteams` (Protected routes to create, update, and fetch teams)
- **Players**: `/api/players`, `/api/players/:id`
- **Matches**: `/api/matches`, `/api/matchstats`

## License

MIT
