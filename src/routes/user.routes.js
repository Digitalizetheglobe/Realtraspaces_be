const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUser, validateUpdateUser } = require('../middlewares/validation.middleware');

// User routes with validation
router.post('/', validateUser, userController.create);
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);
router.put('/:id', validateUpdateUser, userController.update);
router.delete('/:id', userController.delete);

module.exports = router; 