import pool from './pool.js';


export async function createDreamTeam(userId, teamName, formation = '4-3-3') {
  const query = `
    INSERT INTO dream_teams (user_id, team_name, formation)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, teamName, formation]);
  return result.rows[0];
}

export async function getUserDreamTeams(userId) {
  const query = `
    SELECT * FROM dream_teams
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function getDreamTeamById(teamId) {
  const query = `
    SELECT * FROM dream_teams
    WHERE id = $1;
  `;
  const result = await pool.query(query, [teamId]);
  return result.rows[0];
}

export async function getDreamTeamByUserName(userId, teamName) {
  const query = `
    SELECT * FROM dream_teams
    WHERE user_id = $1 AND team_name = $2;
  `;
  const result = await pool.query(query, [userId, teamName]);
  return result.rows[0];
}

export async function updateDreamTeam(teamId, { teamName, formation, captainId, viceCaptainId }) {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (teamName !== undefined) {
    updates.push(`team_name = $${paramCount++}`);
    values.push(teamName);
  }
  if (formation !== undefined) {
    updates.push(`formation = $${paramCount++}`);
    values.push(formation);
  }
  if (captainId !== undefined) {
    updates.push(`captain_id = $${paramCount++}`);
    values.push(captainId);
  }
  if (viceCaptainId !== undefined) {
    updates.push(`vice_captain_id = $${paramCount++}`);
    values.push(viceCaptainId);
  }

  if (updates.length === 0) {
    return await getDreamTeamById(teamId); 
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(teamId);

  const query = `
    UPDATE dream_teams
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deleteDreamTeam(teamId) {
  const query = `
    DELETE FROM dream_teams
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [teamId]);
  return result.rows[0];
}

export async function addPlayerToTeam(dreamTeamId, playerId, position, squadOrder = null) {
  const query = `
    INSERT INTO dream_team_players (dream_team_id, player_id, position, squad_order)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [dreamTeamId, playerId, position, squadOrder]);
  return result.rows[0];
}

export async function getTeamPlayers(dreamTeamId) {
  const query = `
    SELECT 
      dtp.*,
      p.player_name,
      p.position AS player_position,
      p.team,
      p.nation,
      p.age,
      p.market_value,
      p.points,
      p.image_url
    FROM dream_team_players dtp
    INNER JOIN players p ON dtp.player_id = p.id
    WHERE dtp.dream_team_id = $1
    ORDER BY dtp.squad_order ASC;
  `;
  const result = await pool.query(query, [dreamTeamId]);
  return result.rows;
}

export async function removePlayerFromTeam(dreamTeamId, playerId) {
  const query = `
    DELETE FROM dream_team_players
    WHERE dream_team_id = $1 AND player_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [dreamTeamId, playerId]);
  return result.rows[0];
}

export async function updatePlayerInTeam(dreamTeamId, playerId, { position, squadOrder }) {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (position !== undefined) {
    updates.push(`position = $${paramCount++}`);
    values.push(position);
  }
  if (squadOrder !== undefined) {
    updates.push(`squad_order = $${paramCount++}`);
    values.push(squadOrder);
  }

  if (updates.length === 0) {
    return null;
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(dreamTeamId);
  values.push(playerId);

  const query = `
    UPDATE dream_team_players
    SET ${updates.join(', ')}
    WHERE dream_team_id = $${paramCount++} AND player_id = $${paramCount}
    RETURNING *;
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getTeamTotalPoints(dreamTeamId) {
  const query = `
    SELECT 
      SUM(p.points) AS total_points,
      COUNT(dtp.player_id) AS player_count,
      AVG(p.points) AS avg_points
    FROM dream_team_players dtp
    INNER JOIN players p ON dtp.player_id = p.id
    WHERE dtp.dream_team_id = $1;
  `;
  const result = await pool.query(query, [dreamTeamId]);
  return result.rows[0];
}

export async function updateTeamTotalPoints(dreamTeamId) {
  const query = `
    UPDATE dream_teams
    SET total_points = (
      SELECT SUM(p.points)
      FROM dream_team_players dtp
      INNER JOIN players p ON dtp.player_id = p.id
      WHERE dtp.dream_team_id = $1
    ),
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [dreamTeamId]);
  return result.rows[0];
}

export async function getTeamComposition(dreamTeamId) {
  const query = `
    SELECT 
      position,
      COUNT(*) AS count
    FROM dream_team_players
    WHERE dream_team_id = $1
    GROUP BY position;
  `;
  const result = await pool.query(query, [dreamTeamId]);
  return result.rows;
}





