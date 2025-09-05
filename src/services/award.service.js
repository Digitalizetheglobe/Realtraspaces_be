const Award = require('../models/award.model');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

class AwardService {
    
    async createAward(awardData) {
        try {
            const award = await Award.create(awardData);
            return {
                success: true,
                data: award
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAllAwards(searchQuery = null) {
        try {
            const whereClause = {};
            
            if (searchQuery) {
                whereClause[Op.or] = [
                    { award_title: { [Op.like]: `%${searchQuery}%` } },
                    { demo_field: { [Op.like]: `%${searchQuery}%` } }
                ];
            }

            const awards = await Award.findAll({
                where: whereClause,
                order: [['created_at', 'DESC']]
            });

            return {
                success: true,
                data: awards
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getAwardById(id) {
        try {
            const award = await Award.findByPk(id);
            
            if (!award) {
                return {
                    success: false,
                    error: 'Award not found'
                };
            }

            return {
                success: true,
                data: award
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async updateAward(id, updateData) {
        try {
            const award = await Award.findByPk(id);
            
            if (!award) {
                return {
                    success: false,
                    error: 'Award not found'
                };
            }

            // Update award with new data
            await award.update(updateData);

            return {
                success: true,
                data: award
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async deleteAward(id) {
        try {
            const award = await Award.findByPk(id);
            
            if (!award) {
                return {
                    success: false,
                    error: 'Award not found'
                };
            }

            // Delete associated image file if it exists
            if (award.award_image) {
                await this.cleanupImage(award.award_image);
            }

            await award.destroy();

            return {
                success: true,
                message: 'Award deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async cleanupImage(filename) {
        try {
            if (!filename) return;
            
            const imagePath = path.join(__dirname, '..', '..', 'public', 'awardsimages', filename);
            
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image file: ${filename}`);
            }
        } catch (error) {
            console.error(`Error deleting image file ${filename}:`, error);
        }
    }

    async cleanupImages(filenames) {
        if (!Array.isArray(filenames)) return;
        
        for (const filename of filenames) {
            await this.cleanupImage(filename);
        }
    }
}

module.exports = new AwardService();
