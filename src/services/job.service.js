const Job = require('../models/job.model');

class JobService {
    async createJob(jobData) {
        try {
            const job = await Job.create(jobData);
            return { success: true, data: job };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getAllJobs() {
        try {
            const jobs = await Job.findAll({
                where: { isActive: true },
                order: [['postedDate', 'DESC']]
            });
            return { success: true, data: jobs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getJobById(jobId) {
        try {
            const job = await Job.findOne({ where: { jobId } });
            if (!job) {
                return { success: false, error: 'Job not found' };
            }
            return { success: true, data: job };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateJob(jobId, jobData) {
        try {
            const job = await Job.findOne({ where: { jobId } });
            if (!job) {
                return { success: false, error: 'Job not found' };
            }
            await job.update(jobData);
            return { success: true, data: job };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteJob(jobId) {
        try {
            const job = await Job.findOne({ where: { jobId } });
            if (!job) {
                return { success: false, error: 'Job not found' };
            }
            await job.update({ isActive: false });
            return { success: true, message: 'Job deactivated successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new JobService(); 