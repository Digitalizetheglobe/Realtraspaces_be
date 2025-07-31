const Team = require('../models/team.model');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../public/team');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper function to handle file upload
const handleFileUpload = (file) => {
  if (!file) return null;
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.name);
  const filename = `team-${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  // Move the uploaded file to the destination
  file.mv(filepath);
  
  return `/team/${filename}`; // Return the relative path for database storage
};

// Create a new team member
exports.createTeamMember = async (req, res) => {
  try {
    const { full_name, description, linkedin_url, designation, is_working } = req.body;
    let photoName = null;

    console.log('Request files:', req.files); // Debug log
    console.log('Request file:', req.file);   // Debug log

    if (req.file) {
      // Store only the filename in the database
      photoName = req.file.filename;
      console.log('Photo name from multer:', photoName); // Debug log
    }

    const teamMemberData = {
      full_name,
      description,
      linkedin_url,
      designation,
      is_working: is_working === 'true' || is_working === true,
      photo: photoName  // Store only the filename
    };

    console.log('Creating team member with data:', teamMemberData); // Debug log
    const teamMember = await Team.create(teamMemberData);
    
    // Get the plain object and add full URL for the photo
    const responseData = teamMember.get({ plain: true });
    // Add full URL for the photo in the response
    if (responseData.photo) {
      responseData.photo_url = `${req.protocol}://${req.get('host')}/team/${responseData.photo}`;
    }

    return res.status(201).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating team member',
      error: error.message
    });
  }
};

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const { is_working } = req.query;
    const whereClause = {};
    
    if (is_working !== undefined) {
      whereClause.is_working = is_working === 'true';
    }

    const teamMembers = await Team.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      raw: true
    });

    // Add full URL for the photo
    const teamMembersWithPhotoUrl = teamMembers.map(member => {
      const memberData = { ...member };
      if (member.photo) {
        memberData.photo_url = `${req.protocol}://${req.get('host')}/team/${member.photo}`;
      }
      return memberData;
    });

    return res.status(200).json({
      success: true,
      data: teamMembersWithPhotoUrl
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching team members',
      error: error.message
    });
  }
};

// Get single team member by ID
exports.getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Add full URL for the photo
    const teamMemberData = teamMember.get({ plain: true });
    if (teamMemberData.photo) {
      teamMemberData.photo_url = `${req.protocol}://${req.get('host')}/team/${teamMemberData.photo}`;
    }

    return res.status(200).json({
      success: true,
      data: teamMemberData
    });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching team member',
      error: error.message
    });
  }
};

// Update team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, description, linkedin_url, designation, is_working } = req.body;
    
    const teamMember = await Team.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const updateData = {
      full_name: full_name || teamMember.full_name,
      description: description !== undefined ? description : teamMember.description,
      linkedin_url: linkedin_url !== undefined ? linkedin_url : teamMember.linkedin_url,
      designation: designation || teamMember.designation,
      is_working: is_working !== undefined ? (is_working === 'true' || is_working === true) : teamMember.is_working
    };
    
    // Handle file upload if a new photo is provided
    if (req.file) {
      // Delete old photo if exists
      if (teamMember.photo) {
        const oldPhotoPath = path.join(__dirname, '../../../public/team', teamMember.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      // Store only the filename
      updateData.photo = req.file.filename;
    }

    // Update team member
    await teamMember.update(updateData);

    return res.status(200).json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating team member',
      error: error.message
    });
  }
};

// Delete team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teamMember = await Team.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }
    
    // Delete photo file if exists
    if (teamMember.photo) {
      const photoPath = path.join(__dirname, '../../../public/team', teamMember.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }
    
    await teamMember.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting team member',
      error: error.message
    });
  }
};
