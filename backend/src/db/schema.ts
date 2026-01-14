import pool from './pool.js';

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Create dream_teams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dream_teams (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        team_name VARCHAR(255) NOT NULL,
        formation VARCHAR(20) DEFAULT '4-3-3',
        total_points DECIMAL(10, 2) DEFAULT 0,
        captain_id INTEGER,
        vice_captain_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ dream_teams table created successfully');

    // Create dream_team_players table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dream_team_players (
        id SERIAL PRIMARY KEY,
        dream_team_id INTEGER NOT NULL,
        player_id INTEGER NOT NULL,
        position VARCHAR(50) NOT NULL,
        squad_order INTEGER,
        points_earned DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_dream_team FOREIGN KEY (dream_team_id) REFERENCES dream_teams(id) ON DELETE CASCADE,
        CONSTRAINT fk_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        CONSTRAINT unique_team_player UNIQUE (dream_team_id, player_id)
      );
    `);
    console.log('✓ dream_team_players table created successfully');

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_dream_teams_user_id ON dream_teams(user_id);
      CREATE INDEX IF NOT EXISTS idx_dream_team_players_dream_team_id ON dream_team_players(dream_team_id);
      CREATE INDEX IF NOT EXISTS idx_dream_team_players_player_id ON dream_team_players(player_id);
    `);
    console.log('✓ Indexes created successfully');

    return true;
  } catch (err) {
    const error = err as Error;
    console.error('✗ Error creating dream team tables:', error.message);
    return false;
  }
}

export async function dropDreamTeamTables(): Promise<boolean> {
  const dropQuery = `
    DROP TABLE IF EXISTS dream_team_players CASCADE;
    DROP TABLE IF EXISTS dream_teams CASCADE;
  `;
  try {
    await pool.query(dropQuery);
    console.log('✓ Dream team tables dropped successfully');
    return true;
  } catch (err) {
    const error = err as Error;
    console.error('✗ Error dropping tables:', error.message);
    return false;
  }
}
