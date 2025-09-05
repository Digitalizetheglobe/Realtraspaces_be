const express = require('express');
const router = express.Router();
const awardController = require('../controllers/award.controller');
const { uploadSingle } = require('../middleware/awardUpload');

// Create a new award
router.post('/', uploadSingle.single('award_image'), awardController.createAward);

// Get all awards
router.get('/', awardController.getAllAwards);

// Get single award by ID
router.get('/:id', awardController.getAwardById);

// Update award
router.put('/:id', uploadSingle.single('award_image'), awardController.updateAward);

// Delete award
router.delete('/:id', awardController.deleteAward);

module.exports = router;
