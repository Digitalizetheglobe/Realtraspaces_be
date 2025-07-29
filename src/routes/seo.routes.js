const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seo.controller');

// SEO Meta Tags Routes
router.post('/meta-tags', seoController.upsertMetaTags);
router.get('/meta-tags/:page', seoController.getMetaByPage);

module.exports = router;
