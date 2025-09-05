const CVSubmission = require('../models/cvSubmission.model');
const { Op } = require('sequelize');

// Helper function to construct full URL from filename
const constructFileUrl = (req, filename) => {
  if (!filename) return null;
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/resume/${filename}`;
};

// Helper function to extract filename from URL
const extractFilenameFromUrl = (url) => {
  if (!url) return null;
  return url.split('/').pop();
};

// Helper function to add URLs to CV submission data for API response
const addUrlsToCVSubmission = (req, submission) => {
  const submissionData = submission.toJSON ? submission.toJSON() : submission;
  
  // Add full URL for cv_file
  if (submissionData.cv_file) {
    submissionData.cv_file_url = constructFileUrl(req, submissionData.cv_file);
  }
  
  return submissionData;
};

// Submit CV (Create new submission)
exports.submitCV = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, message } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !phone_number || !email_id) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, phone number, and email are required'
      });
    }

    // Store only filename, not full URL
    let cv_file = null;
    if (req.file) {
      cv_file = req.file.filename;
    }

    const submission = await CVSubmission.create({
      first_name,
      last_name,
      phone_number,
      email_id,
      message: message || null,
      cv_file
    });

    // Add URLs for response
    const submissionWithUrls = addUrlsToCVSubmission(req, submission);

    return res.status(201).json({
      success: true,
      message: 'CV submitted successfully',
      data: submissionWithUrls
    });
  } catch (error) {
    console.error('Error submitting CV:', error);
    
    // Clean up uploaded file if submission fails
    if (req.file) {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', '..', 'public', 'resume', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error submitting CV',
      error: error.message
    });
  }
};

// Get all CV submissions (Admin function)
exports.getAllSubmissions = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email_id: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } }
      ];
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows: submissions } = await CVSubmission.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add URLs for each submission
    const submissionsWithUrls = submissions.map(submission => addUrlsToCVSubmission(req, submission));

    return res.status(200).json({
      success: true,
      count: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: submissionsWithUrls
    });
  } catch (error) {
    console.error('Error fetching CV submissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching CV submissions',
      error: error.message
    });
  }
};

// Get single CV submission by ID
exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await CVSubmission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'CV submission not found'
      });
    }

    // Add URLs for response
    const submissionWithUrls = addUrlsToCVSubmission(req, submission);

    return res.status(200).json({
      success: true,
      data: submissionWithUrls
    });
  } catch (error) {
    console.error('Error fetching CV submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching CV submission',
      error: error.message
    });
  }
};

// Update CV submission status (Admin function)
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const submission = await CVSubmission.findByPk(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'CV submission not found'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'contacted', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    // Update fields
    if (status !== undefined) submission.status = status;
    if (admin_notes !== undefined) submission.admin_notes = admin_notes;

    await submission.save();

    // Add URLs for response
    const submissionWithUrls = addUrlsToCVSubmission(req, submission);

    return res.status(200).json({
      success: true,
      message: 'CV submission updated successfully',
      data: submissionWithUrls
    });
  } catch (error) {
    console.error('Error updating CV submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating CV submission',
      error: error.message
    });
  }
};

// Delete CV submission (Admin function)
exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await CVSubmission.findByPk(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'CV submission not found'
      });
    }

    // Delete associated CV file if it exists
    if (submission.cv_file) {
      try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', '..', 'public', 'resume', submission.cv_file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting CV file:', error);
      }
    }

    await submission.destroy();

    return res.status(200).json({
      success: true,
      message: 'CV submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting CV submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting CV submission',
      error: error.message
    });
  }
};

// Download CV file
exports.downloadCV = async (req, res) => {
  try {
    const { filename } = req.params;
    const path = require('path');
    const fs = require('fs');
    
    const filePath = path.join(__dirname, '..', '..', 'public', 'resume', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'CV file not found'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading CV:', error);
    return res.status(500).json({
      success: false,
      message: 'Error downloading CV',
      error: error.message
    });
  }
};

// Get submission statistics (Admin function)
exports.getSubmissionStats = async (req, res) => {
  try {
    const stats = await CVSubmission.findAll({
      attributes: [
        'status',
        [CVSubmission.sequelize.fn('COUNT', CVSubmission.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const totalSubmissions = await CVSubmission.count();

    return res.status(200).json({
      success: true,
      data: {
        total: totalSubmissions,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.dataValues.count);
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching submission stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching submission statistics',
      error: error.message
    });
  }
};
