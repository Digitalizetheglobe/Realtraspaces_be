const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const upload = require('../middleware/upload');

// Create a new team member
router.post('/', upload.single('photo'), teamController.createTeamMember);

// Get all team members
router.get('/', teamController.getAllTeamMembers);

// Get single team member by ID
router.get('/:id', teamController.getTeamMemberById);

// Update team member
router.put('/:id', upload.single('photo'), teamController.updateTeamMember);

// Delete team member
router.delete('/:id', teamController.deleteTeamMember);

module.exports = router;
