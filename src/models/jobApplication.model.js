const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'job_id',
        references: {
            model: 'jobs',
            key: 'job_id'
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'first_name'
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'last_name'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currentCompany: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'current_company'
    },
    linkedInProfileLink: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'linkedin_profile_link'
    },
    experienceYears: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'experience_years'
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: true
    },
    additionalDocuments: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'additional_documents'
    },
    status: {
        type: DataTypes.ENUM(
            'under_review',
            'rejected',
            'offered',
            'hired',
            'selected_for_next_round'
        ),
        allowNull: false,
        defaultValue: 'under_review'
    }
}, {
    tableName: 'job_applications',
    timestamps: true,
    underscored: true
});

module.exports = JobApplication; 