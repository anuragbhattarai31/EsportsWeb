const { getAllTeams, getTeamWithPlayers } = require('../models/teamModel');

const listTeams = async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

const getTeamDetails = async (req, res) => {
  try {
    const team = await getTeamWithPlayers(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
};

const { addPlayerToTeam, removePlayerFromTeam } = require('../models/teamModel');

const addPlayer = async (req, res) => {
  try {
    // Validate request body
    const { player_name, role, student_id } = req.body;
    if (!player_name || !role || !student_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const player = await addPlayerToTeam(req.params.teamId, {
      player_name,
      role,
      student_id
    });
    
    res.status(201).json(player);
  } catch (error) {
    console.error('Player creation error:', error);
    const statusCode = error.code === '23505' ? 409 : 500; // Handle unique constraint
    res.status(statusCode).json({ 
      error: error.code === '23505' 
        ? 'Student ID already exists' 
        : 'Failed to add player' 
    });
  }
};

const removePlayer = async (req, res) => {
  try {
    const player = await removePlayerFromTeam(req.params.playerId);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json({ message: 'Player removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove player' });
  }
};


module.exports = { listTeams, getTeamDetails, addPlayer, removePlayer };