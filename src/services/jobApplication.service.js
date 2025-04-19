const JobApplication = require('../models/jobApplication.model');

class JobApplicationService {
    async createApplication(applicationData) {
        try {
            const application = await JobApplication.create(applicationData);
            return { success: true, data: application };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getAllApplications() {
        try {
            const applications = await JobApplication.findAll({
                order: [['createdAt', 'DESC']]
            });
            return { success: true, data: applications };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getApplicationsByJobId(jobId) {
        try {
            const applications = await JobApplication.findAll({
                where: { jobId },
                order: [['createdAt', 'DESC']]
            });
            return { success: true, data: applications };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getApplicationById(id) {
        try {
            const application = await JobApplication.findByPk(id);
            if (!application) {
                return { success: false, error: 'Application not found' };
            }
            return { success: true, data: application };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateApplicationStatus(id, status) {
        try {
            const application = await JobApplication.findByPk(id);
            if (!application) {
                return { success: false, error: 'Application not found' };
            }
            await application.update({ status });
            return { success: true, data: application };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new JobApplicationService(); 