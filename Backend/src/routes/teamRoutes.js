const express = require('express');
const router = express.Router();
const { listTeams, getTeamDetails,addPlayer,removePlayer } = require('../controllers/teamController');

router.get('/', listTeams);
router.get('/:id', getTeamDetails);
router.post('/:teamId/players', addPlayer);
router.delete('/:teamId/players/:playerId', removePlayer);

module.exports = router;