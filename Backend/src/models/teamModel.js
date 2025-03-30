const pool = require('../db');

// Updated getAllTeams function
const getAllTeams = async () => {
  const result = await pool.query(`
    SELECT 
      t.*, 
      json_agg(json_build_object(
        'id', p.id,
        'player_name', p.player_name,
        'role', p.role,
        'student_id', p.student_id
      )) AS players
    FROM teams t
    LEFT JOIN players p ON t.id = p.team_id
    GROUP BY t.id
    ORDER BY t.game_name
  `);
  return result.rows;
};
const getTeamWithPlayers = async (teamId) => {
  const result = await pool.query(`
    SELECT t.*, p.player_name, p.role, p.student_id 
    FROM teams t
    LEFT JOIN players p ON t.id = p.team_id
    WHERE t.id = $1
  `, [teamId]);
  
  if (result.rows.length === 0) return null;
  
  return {
    team: result.rows[0],
    players: result.rows.filter(row => row.player_name)
  };
};

const addPlayerToTeam = async (teamId, playerData) => {
    const { player_name, role, student_id } = playerData;
    const result = await pool.query(
      `INSERT INTO players (team_id, player_name, role, student_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [teamId, player_name, role, student_id]
    );
    return result.rows[0];
  };
  
  const removePlayerFromTeam = async (playerId) => {
    const result = await pool.query(
      'DELETE FROM players WHERE id = $1 RETURNING *',
      [playerId]
    );
    return result.rows[0];
  };

module.exports = { getAllTeams, getTeamWithPlayers, addPlayerToTeam, removePlayerFromTeam };