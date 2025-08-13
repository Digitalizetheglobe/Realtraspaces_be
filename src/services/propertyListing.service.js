const PropertyListing = require('../models/propertyListing.model');
const { Op } = require('sequelize');

class PropertyListingService {
  // Create a new property listing
  static async createPropertyListing(data) {
    try {
      const propertyListing = await PropertyListing.create(data);
      return {
        success: true,
        data: propertyListing
      };
    } catch (error) {
      throw error;
    }
  }

  // Get all property listings with filters and pagination
  static async getAllPropertyListings(filters = {}, pagination = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        propertyType,
        transactionType,
        location,
        search
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause = { isActive: true };

      // Add filters
      if (status) whereClause.status = status;
      if (propertyType) whereClause.propertyType = propertyType;
      if (transactionType) whereClause.transactionType = transactionType;
          if (location) whereClause.location = { [Op.like]: `%${location}%` };
    if (search) {
      whereClause[Op.or] = [
        { propertyName: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

      const { count, rows } = await PropertyListing.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        data: {
          listings: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get property listing by ID
  static async getPropertyListingById(id) {
    try {
      const propertyListing = await PropertyListing.findOne({
        where: { id, isActive: true }
      });

      if (!propertyListing) {
        return {
          success: false,
          message: 'Property listing not found'
        };
      }

      return {
        success: true,
        data: propertyListing
      };
    } catch (error) {
      throw error;
    }
  }

  // Update property listing
  static async updatePropertyListing(id, updateData) {
    try {
      const propertyListing = await PropertyListing.findOne({
        where: { id, isActive: true }
      });

      if (!propertyListing) {
        return {
          success: false,
          message: 'Property listing not found'
        };
      }

      await propertyListing.update(updateData);

      return {
        success: true,
        data: propertyListing
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete property listing (soft delete)
  static async deletePropertyListing(id) {
    try {
      const propertyListing = await PropertyListing.findOne({
        where: { id, isActive: true }
      });

      if (!propertyListing) {
        return {
          success: false,
          message: 'Property listing not found'
        };
      }

      await propertyListing.update({ isActive: false });

      return {
        success: true,
        message: 'Property listing deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete all property listings (soft delete)
  static async deleteAllPropertyListings() {
    try {
      const result = await PropertyListing.update(
        { isActive: false },
        { where: { isActive: true } }
      );

      return {
        success: true,
        message: `Successfully deleted ${result[0]} property listings`
      };
    } catch (error) {
      throw error;
    }
  }

  // Get property listings by status
  static async getPropertyListingsByStatus(status, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const { count, rows } = await PropertyListing.findAndCountAll({
        where: { status, isActive: true },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      return {
        success: true,
        data: {
          listings: rows,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: count,
            itemsPerPage: parseInt(limit)
          }
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update property listing status
  static async updatePropertyListingStatus(id, status) {
    try {
      const propertyListing = await PropertyListing.findOne({
        where: { id, isActive: true }
      });

      if (!propertyListing) {
        return {
          success: false,
          message: 'Property listing not found'
        };
      }

      await propertyListing.update({ status });

      return {
        success: true,
        data: propertyListing
      };
    } catch (error) {
      throw error;
    }
  }

  // Get property listing statistics
  static async getPropertyListingStats() {
    try {
      const totalListings = await PropertyListing.count({
        where: { isActive: true }
      });

      const pendingListings = await PropertyListing.count({
        where: { status: 'pending', isActive: true }
      });

      const approvedListings = await PropertyListing.count({
        where: { status: 'approved', isActive: true }
      });

      const activeListings = await PropertyListing.count({
        where: { status: 'active', isActive: true }
      });

      const rejectedListings = await PropertyListing.count({
        where: { status: 'rejected', isActive: true }
      });

      // Get counts by property type
      const propertyTypeStats = await PropertyListing.findAll({
        attributes: [
          'propertyType',
          [PropertyListing.sequelize.fn('COUNT', PropertyListing.sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['propertyType']
      });

      // Get counts by transaction type
      const transactionTypeStats = await PropertyListing.findAll({
        attributes: [
          'transactionType',
          [PropertyListing.sequelize.fn('COUNT', PropertyListing.sequelize.col('id')), 'count']
        ],
        where: { isActive: true },
        group: ['transactionType']
      });

      return {
        success: true,
        data: {
          total: totalListings,
          pending: pendingListings,
          approved: approvedListings,
          active: activeListings,
          rejected: rejectedListings,
          byPropertyType: propertyTypeStats,
          byTransactionType: transactionTypeStats
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PropertyListingService;
