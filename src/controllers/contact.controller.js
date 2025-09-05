const Contact = require('../models/contact.model');
const { Op } = require('sequelize');

// Submit contact form (Public endpoint)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone_number, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone_number || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (name, email, phone_number, subject, message) are required'
      });
    }

    // Get client IP address and user agent for tracking
    const ip_address = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
                      (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const user_agent = req.get('User-Agent') || null;

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone_number: phone_number.trim(),
      subject: subject.trim(),
      message: message.trim(),
      ip_address,
      user_agent
    });

    return res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        created_at: contact.created_at
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message
    });
  }
};

// Get all contacts (Admin endpoint)
exports.getAllContacts = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } }
      ];
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const { count, rows: contacts } = await Contact.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return res.status(200).json({
      success: true,
      count: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// Get single contact by ID (Admin endpoint)
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Mark as read if it's new
    if (contact.status === 'new') {
      await contact.update({ status: 'read' });
    }

    return res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
};

// Update contact status (Admin endpoint)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Validate status
    const validStatuses = ['new', 'read', 'responded', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    // Update fields
    const updateData = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'responded') {
        updateData.responded_at = new Date();
      }
    }
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    await contact.update(updateData);

    return res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

// Delete contact (Admin endpoint)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.destroy();

    return res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

// Get contact statistics (Admin endpoint)
exports.getContactStats = async (req, res) => {
  try {
    // Get statistics by status
    const stats = await Contact.findAll({
      attributes: [
        'status',
        [Contact.sequelize.fn('COUNT', Contact.sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get total contacts
    const totalContacts = await Contact.count();

    // Get contacts from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentContacts = await Contact.count({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Get daily contacts for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Contact.findAll({
      attributes: [
        [Contact.sequelize.fn('DATE', Contact.sequelize.col('created_at')), 'date'],
        [Contact.sequelize.fn('COUNT', Contact.sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [Contact.sequelize.fn('DATE', Contact.sequelize.col('created_at'))],
      order: [[Contact.sequelize.fn('DATE', Contact.sequelize.col('created_at')), 'ASC']]
    });

    const byStatus = stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.dataValues.count);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        total: totalContacts,
        recent: recentContacts,
        byStatus,
        dailyStats: dailyStats.map(stat => ({
          date: stat.dataValues.date,
          count: parseInt(stat.dataValues.count)
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: error.message
    });
  }
};

// Bulk operations (Admin endpoint)
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status, admin_notes } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of contact IDs'
      });
    }

    const validStatuses = ['new', 'read', 'responded', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const updateData = { status };
    if (status === 'responded') {
      updateData.responded_at = new Date();
    }
    if (admin_notes) {
      updateData.admin_notes = admin_notes;
    }

    const [affectedCount] = await Contact.update(updateData, {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${affectedCount} contacts`,
      affectedCount
    });
  } catch (error) {
    console.error('Error bulk updating contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error bulk updating contacts',
      error: error.message
    });
  }
};
