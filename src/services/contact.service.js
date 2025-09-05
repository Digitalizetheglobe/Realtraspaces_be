const Contact = require('../models/contact.model');
const { Op } = require('sequelize');

class ContactService {
    
    async submitContact(contactData) {
        try {
            // Clean and validate data
            const cleanData = {
                name: contactData.name?.trim(),
                email: contactData.email?.trim()?.toLowerCase(),
                phone_number: contactData.phone_number?.trim(),
                subject: contactData.subject?.trim(),
                message: contactData.message?.trim(),
                ip_address: contactData.ip_address,
                user_agent: contactData.user_agent
            };

            const contact = await Contact.create(cleanData);
            
            // Send notification emails
            await this.sendContactNotificationEmail(contact);
            await this.sendContactConfirmationEmail(contact);
            
            return {
                success: true,
                data: contact
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAllContacts(options = {}) {
        try {
            const { search, status, page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = options;
            const whereClause = {};
            
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone_number: { [Op.like]: `%${search}%` } },
                    { subject: { [Op.like]: `%${search}%` } },
                    { message: { [Op.like]: `%${search}%` } }
                ];
            }

            if (status) {
                whereClause.status = status;
            }

            const offset = (page - 1) * limit;

            const result = await Contact.findAndCountAll({
                where: whereClause,
                order: [[sort, order.toUpperCase()]],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                success: true,
                data: result.rows,
                count: result.count,
                totalPages: Math.ceil(result.count / limit),
                currentPage: parseInt(page)
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getContactById(id) {
        try {
            const contact = await Contact.findByPk(id);
            
            if (!contact) {
                return {
                    success: false,
                    error: 'Contact not found'
                };
            }

            // Mark as read if it's new
            if (contact.status === 'new') {
                await contact.update({ status: 'read' });
            }

            return {
                success: true,
                data: contact
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateContactStatus(id, updateData) {
        try {
            const contact = await Contact.findByPk(id);
            
            if (!contact) {
                return {
                    success: false,
                    error: 'Contact not found'
                };
            }

            const oldStatus = contact.status;
            
            // Add responded_at timestamp if status is changing to responded
            if (updateData.status === 'responded' && oldStatus !== 'responded') {
                updateData.responded_at = new Date();
            }

            await contact.update(updateData);

            // Send status update email if status changed
            if (updateData.status && updateData.status !== oldStatus) {
                await this.sendStatusUpdateEmail(contact, oldStatus);
            }

            return {
                success: true,
                data: contact
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteContact(id) {
        try {
            const contact = await Contact.findByPk(id);
            
            if (!contact) {
                return {
                    success: false,
                    error: 'Contact not found'
                };
            }

            await contact.destroy();

            return {
                success: true,
                message: 'Contact deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getContactStats() {
        try {
            // Get statistics by status
            const stats = await Contact.findAll({
                attributes: [
                    'status',
                    [Contact.sequelize.fn('COUNT', Contact.sequelize.col('id')), 'count']
                ],
                group: ['status']
            });

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

            // Get average response time for responded contacts
            const responseTimeQuery = await Contact.sequelize.query(`
                SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, responded_at)) as avg_response_hours
                FROM contacts 
                WHERE status = 'responded' AND responded_at IS NOT NULL
            `, { type: Contact.sequelize.QueryTypes.SELECT });

            const avgResponseHours = responseTimeQuery[0]?.avg_response_hours || 0;

            const byStatus = stats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.dataValues.count);
                return acc;
            }, {});

            return {
                success: true,
                data: {
                    total: totalContacts,
                    recent: recentContacts,
                    byStatus,
                    avgResponseHours: Math.round(avgResponseHours * 100) / 100
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async bulkUpdateStatus(ids, status, admin_notes = null) {
        try {
            if (!Array.isArray(ids) || ids.length === 0) {
                return {
                    success: false,
                    error: 'Please provide an array of contact IDs'
                };
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

            return {
                success: true,
                affectedCount,
                message: `Successfully updated ${affectedCount} contacts`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Email notification methods (can be implemented later with actual email service)
    async sendContactNotificationEmail(contact) {
        try {
            // TODO: Implement email sending logic for admin notification
            console.log(`Sending admin notification for new contact: ${contact.id}`);
            
            const emailContent = {
                to: process.env.ADMIN_EMAIL || 'admin@realtraspaces.com',
                subject: `New Contact Form Submission - ${contact.subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${contact.name}</p>
                    <p><strong>Email:</strong> ${contact.email}</p>
                    <p><strong>Phone:</strong> ${contact.phone_number}</p>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${contact.message}</p>
                    <p><strong>Submitted:</strong> ${contact.created_at}</p>
                    <p><strong>IP Address:</strong> ${contact.ip_address || 'N/A'}</p>
                `
            };

            return { success: true, message: 'Admin notification email queued' };
        } catch (error) {
            console.error('Error sending admin notification email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendContactConfirmationEmail(contact) {
        try {
            // TODO: Implement email sending logic for customer confirmation
            console.log(`Sending confirmation email to ${contact.email}`);
            
            const emailContent = {
                to: contact.email,
                subject: 'Thank you for contacting Realtraspaces',
                html: `
                    <h2>Thank you for contacting us!</h2>
                    <p>Dear ${contact.name},</p>
                    <p>We have received your message and will get back to you within 24-48 hours.</p>
                    
                    <h3>Your Message Details:</h3>
                    <p><strong>Subject:</strong> ${contact.subject}</p>
                    <p><strong>Message:</strong> ${contact.message}</p>
                    <p><strong>Submitted:</strong> ${contact.created_at}</p>
                    
                    <p>Best regards,<br>Realtraspaces Team</p>
                `
            };

            return { success: true, message: 'Confirmation email queued' };
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendStatusUpdateEmail(contact, oldStatus) {
        try {
            // TODO: Implement status update email (if needed)
            console.log(`Contact ${contact.id} status updated: ${oldStatus} -> ${contact.status}`);
            
            return { success: true, message: 'Status update processed' };
        } catch (error) {
            console.error('Error processing status update:', error);
            return { success: false, error: error.message };
        }
    }

    // Utility methods
    async getUnreadCount() {
        try {
            const count = await Contact.count({
                where: { status: 'new' }
            });
            return { success: true, count };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async markAllAsRead() {
        try {
            const [affectedCount] = await Contact.update(
                { status: 'read' },
                { where: { status: 'new' } }
            );
            return { success: true, affectedCount };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new ContactService();
