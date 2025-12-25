const mongoose = require('mongoose');

const examinationDataAccessSchema = new mongoose.Schema({
  academic_year_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true
  },
  class_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  section_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section'
  }],
  medium_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medium'
  }],
  subject_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  user_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  permissions: {
    view: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
examinationDataAccessSchema.index({ academic_year_id: 1 });
examinationDataAccessSchema.index({ user_ids: 1 });
examinationDataAccessSchema.index({ class_ids: 1 });
examinationDataAccessSchema.index({ section_ids: 1 });

// Method to check if a user has access to specific examination data
examinationDataAccessSchema.statics.checkUserAccess = async function(userId, filters = {}) {
  const query = {
    user_ids: userId
  };

  // Add academic year filter (required exact match)
  if (filters.academic_year_id) {
    query.academic_year_id = filters.academic_year_id;
  }

  // Build $and conditions for each filter
  const andConditions = [];

  // Class filter: empty array means all classes, otherwise must match
  if (filters.class_id) {
    andConditions.push({
      $or: [
        { class_ids: { $size: 0 } }, // Empty means all classes
        { class_ids: filters.class_id }
      ]
    });
  }

  // Section filter: empty array means all sections, otherwise must match
  if (filters.section_id) {
    andConditions.push({
      $or: [
        { section_ids: { $size: 0 } }, // Empty means all sections
        { section_ids: filters.section_id }
      ]
    });
  }

  // Medium filter: empty array means all mediums, otherwise must match
  if (filters.medium_id) {
    andConditions.push({
      $or: [
        { medium_ids: { $size: 0 } }, // Empty means all mediums
        { medium_ids: filters.medium_id }
      ]
    });
  }

  // Subject filter: empty array means all subjects, otherwise must match
  if (filters.subject_id) {
    andConditions.push({
      $or: [
        { subject_ids: { $size: 0 } }, // Empty means all subjects
        { subject_ids: filters.subject_id }
      ]
    });
  }

  // Add all conditions using $and
  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  const accessRecord = await this.findOne(query);
  
  if (!accessRecord) {
    return { hasAccess: false, permissions: null };
  }

  return {
    hasAccess: true,
    permissions: accessRecord.permissions
  };
};

const ExaminationDataAccess = mongoose.model('ExaminationDataAccess', examinationDataAccessSchema);

module.exports = ExaminationDataAccess;
