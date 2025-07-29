const SeoMetaTag = require('../models/SeoMetaTag.model');

exports.upsertMetaTags = async (req, res) => {
  const { page, metaTitle, metaDescription, metaKeywords, canonicalUrl } = req.body;

  // Validate required fields
  if (!page) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Page identifier is required' 
    });
  }

  try {
    const [seo, created] = await SeoMetaTag.upsert({
      page,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
      canonicalUrl: canonicalUrl || null
    }, {
      returning: true
    });

    res.status(200).json({
      status: 'success',
      message: created ? 'SEO meta created successfully' : 'SEO meta updated successfully',
      data: seo
    });
  } catch (err) {
    console.error('Error in upsertMetaTags:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update SEO meta tags',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.getMetaByPage = async (req, res) => {
  const { page } = req.params;

  if (!page) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Page parameter is required' 
    });
  }

  try {
    const data = await SeoMetaTag.findOne({ 
      where: { page },
      attributes: ['id', 'page', 'metaTitle', 'metaDescription', 'metaKeywords', 'canonicalUrl', 'createdAt', 'updatedAt']
    });

    if (!data) {
      return res.status(404).json({ 
        status: 'not_found', 
        message: 'No SEO data found for this page' 
      });
    }

    res.status(200).json({ 
      status: 'success', 
      data 
    });
  } catch (err) {
    console.error('Error in getMetaByPage:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch SEO meta tags',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
