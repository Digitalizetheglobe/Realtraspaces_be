const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seo.controller');

// SEO Meta Tags Routes
router.post('/meta-tags', seoController.upsertMetaTags);
router.get('/meta-tags/:page', seoController.getMetaByPage);
router.get('/meta-tags', seoController.getAllMetaTags);
router.put('/meta-tags/:identifier', seoController.updateMetaTags);
router.delete('/meta-tags/:identifier', seoController.deleteMetaTags);
module.exports = router;
