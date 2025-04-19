const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'job_title'
    },
    jobId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'job_id'
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    jobType: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'job_type'
    },
    experienceLevel: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'experience_level'
    },
    salaryRange: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'salary_range'
    },
    postedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'posted_date'
    },
    applicationDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'application_deadline'
    },
    jobDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'job_description'
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    benefits: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    additionalDocFiles: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'additional_doc_files'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'jobs',
    timestamps: true,
    underscored: true
});

module.exports = Job; 