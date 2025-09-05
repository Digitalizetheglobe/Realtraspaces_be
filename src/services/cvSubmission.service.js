const CVSubmission = require('../models/cvSubmission.model');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

class CVSubmissionService {
    
    async submitCV(submissionData) {
        try {
            const submission = await CVSubmission.create(submissionData);
            
            // Send confirmation email to candidate
            await this.sendConfirmationEmail(submission);
            
            // Send notification email to HR/Admin
            await this.sendAdminNotificationEmail(submission);
            
            return {
                success: true,
                data: submission
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAllSubmissions(options = {}) {
        try {
            const { search, status, page = 1, limit = 10 } = options;
            const whereClause = {};
            
            if (search) {
                whereClause[Op.or] = [
                    { first_name: { [Op.like]: `%${search}%` } },
                    { last_name: { [Op.like]: `%${search}%` } },
                    { email_id: { [Op.like]: `%${search}%` } },
                    { phone_number: { [Op.like]: `%${search}%` } }
                ];
            }

            if (status) {
                whereClause.status = status;
            }

            const offset = (page - 1) * limit;

            const result = await CVSubmission.findAndCountAll({
                where: whereClause,
                order: [['created_at', 'DESC']],
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

    async getSubmissionById(id) {
        try {
            const submission = await CVSubmission.findByPk(id);
            
            if (!submission) {
                return {
                    success: false,
                    error: 'CV submission not found'
                };
            }

            return {
                success: true,
                data: submission
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateSubmissionStatus(id, updateData) {
        try {
            const submission = await CVSubmission.findByPk(id);
            
            if (!submission) {
                return {
                    success: false,
                    error: 'CV submission not found'
                };
            }

            const oldStatus = submission.status;
            await submission.update(updateData);

            // Send status update email if status changed
            if (updateData.status && updateData.status !== oldStatus) {
                await this.sendStatusUpdateEmail(submission, oldStatus);
            }

            return {
                success: true,
                data: submission
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteSubmission(id) {
        try {
            const submission = await CVSubmission.findByPk(id);
            
            if (!submission) {
                return {
                    success: false,
                    error: 'CV submission not found'
                };
            }

            // Delete associated CV file if it exists
            if (submission.cv_file) {
                await this.cleanupFile(submission.cv_file);
            }

            await submission.destroy();

            return {
                success: true,
                message: 'CV submission deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getSubmissionStats() {
        try {
            const stats = await CVSubmission.findAll({
                attributes: [
                    'status',
                    [CVSubmission.sequelize.fn('COUNT', CVSubmission.sequelize.col('id')), 'count']
                ],
                group: ['status']
            });

            const totalSubmissions = await CVSubmission.count();

            const byStatus = stats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.dataValues.count);
                return acc;
            }, {});

            return {
                success: true,
                data: {
                    total: totalSubmissions,
                    byStatus
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async cleanupFile(filename) {
        try {
            if (!filename) return;
            
            const filePath = path.join(__dirname, '..', '..', 'public', 'resume', filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted CV file: ${filename}`);
            }
        } catch (error) {
            console.error(`Error deleting CV file ${filename}:`, error);
        }
    }

    async cleanupFiles(filenames) {
        if (!Array.isArray(filenames)) return;
        
        for (const filename of filenames) {
            await this.cleanupFile(filename);
        }
    }

    // Email notification methods (can be implemented later with actual email service)
    async sendConfirmationEmail(submission) {
        try {
            // TODO: Implement email sending logic
            console.log(`Sending confirmation email to ${submission.email_id}`);
            
            // Example email content
            const emailContent = {
                to: submission.email_id,
                subject: 'CV Submission Confirmation - Realtraspaces',
                text: `Dear ${submission.first_name} ${submission.last_name},
                
Thank you for submitting your CV to Realtraspaces. We have received your application and will review it shortly.

Submission Details:
- Name: ${submission.first_name} ${submission.last_name}
- Email: ${submission.email_id}
- Phone: ${submission.phone_number}
- Submission Date: ${submission.submission_date}

We will contact you if your profile matches our current requirements.

Best regards,
Realtraspaces HR Team`
            };

            return { success: true, message: 'Confirmation email queued' };
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendAdminNotificationEmail(submission) {
        try {
            // TODO: Implement admin notification email
            console.log(`Sending admin notification for new CV submission: ${submission.id}`);
            
            return { success: true, message: 'Admin notification email queued' };
        } catch (error) {
            console.error('Error sending admin notification email:', error);
            return { success: false, error: error.message };
        }
    }

    async sendStatusUpdateEmail(submission, oldStatus) {
        try {
            // TODO: Implement status update email
            console.log(`Sending status update email for submission ${submission.id}: ${oldStatus} -> ${submission.status}`);
            
            return { success: true, message: 'Status update email queued' };
        } catch (error) {
            console.error('Error sending status update email:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new CVSubmissionService();
