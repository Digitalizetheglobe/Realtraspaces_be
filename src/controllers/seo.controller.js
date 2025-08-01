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
    console.error('Error in upsertMetaTags:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      originalError: err.original ? {
        code: err.original.code,
        errno: err.original.errno,
        sqlMessage: err.original.sqlMessage,
        sql: err.original.sql,
        parameters: err.original.parameters
      } : null
    });
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update SEO meta tags',
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        sqlError: err.original ? {
          code: err.original.code,
          sqlMessage: err.original.sqlMessage
        } : null
      } : undefined
    });
  }
};
exports.getAllMetaTags = async (req, res) => {
  try {
    const data = await SeoMetaTag.findAll({
      attributes: ['id', 'page', 'metaTitle', 'metaDescription', 'metaKeywords', 'canonicalUrl', 'createdAt', 'updatedAt']
    });

    res.status(200).json({ 
      status: 'success', 
      data 
    });
  } catch (err) {
    console.error('Error in getAllMetaTags:', err);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to fetch all SEO meta tags',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.updateMetaTags = async (req, res) => {
  const { identifier } = req.params;

  if (!identifier) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Identifier parameter is required' 
    });
  }

  try {
    console.log('Received update request with data:', {
      identifier,
      body: req.body
    });

    // Check if identifier is a number (ID) or string (page name)
    const isNumeric = !isNaN(parseInt(identifier));
    const whereClause = isNumeric ? { id: identifier } : { page: identifier };

    console.log('Searching for record with:', whereClause);
    
    // First find the record to update
    const record = await SeoMetaTag.findOne({ where: whereClause });
    
    if (!record) {
      console.log('No record found with:', whereClause);
      return res.status(404).json({ 
        status: 'not_found', 
        message: 'No SEO data found for this identifier' 
      });
    }

    console.log('Found record:', record.toJSON());
    console.log('Updating with data:', req.body);

    // Prepare update data (exclude id and page from the update)
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData.page;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    console.log('Prepared update data:', updateData);

    // Update the record
    const [affectedCount, updatedRecords] = await SeoMetaTag.update(updateData, {
      where: whereClause,
      returning: true,
      individualHooks: true
    });

    console.log('Update result:', {
      affectedCount,
      updatedRecords: updatedRecords ? updatedRecords.map(r => r.toJSON()) : null
    });

    if (affectedCount === 0 || !updatedRecords || updatedRecords.length === 0) {
      console.error('Update failed - no records affected or returned');
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to update SEO meta tags - no records were updated',
        details: process.env.NODE_ENV === 'development' ? {
          whereClause,
          updateData,
          affectedCount,
          hasUpdatedRecords: !!(updatedRecords && updatedRecords.length > 0)
        } : undefined
      });
    }

    res.status(200).json({ 
      status: 'success',
      message: 'SEO meta tags updated successfully',
      data: updatedRecord
    });
  } catch (err) {
    console.error('Error in updateMetaTags:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      originalError: err.original ? {
        code: err.original.code,
        errno: err.original.errno,
        sqlMessage: err.original.sqlMessage,
        sql: err.original.sql,
        parameters: err.original.parameters
      } : null
    });
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to update SEO meta tags',
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        sqlError: err.original ? {
          code: err.original.code,
          sqlMessage: err.original.sqlMessage
        } : null
      } : undefined
    });
  }
};
exports.deleteMetaTags = async (req, res) => {
  const { identifier } = req.params;

  if (!identifier) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Identifier parameter is required' 
    });
  }

  try {
    // Check if identifier is a number (ID) or string (page name)
    const isNumeric = !isNaN(parseInt(identifier));
    const whereClause = isNumeric ? { id: identifier } : { page: identifier };

    // First check if the record exists
    const record = await SeoMetaTag.findOne({ where: whereClause });
    
    if (!record) {
      return res.status(404).json({ 
        status: 'not_found', 
        message: 'No SEO data found for this identifier' 
      });
    }

    // Delete the record
    const deletedCount = await SeoMetaTag.destroy({ where: whereClause });

    if (deletedCount === 0) {
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to delete SEO meta tags' 
      });
    }

    res.status(200).json({ 
      status: 'success',
      message: 'SEO meta tags deleted successfully'
    });
  } catch (err) {
    console.error('Error in deleteMetaTags:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      originalError: err.original ? {
        code: err.original.code,
        errno: err.original.errno,
        sqlMessage: err.original.sqlMessage,
        sql: err.original.sql,
        parameters: err.original.parameters
      } : null
    });
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to delete SEO meta tags',
      error: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        sqlError: err.original ? {
          code: err.original.code,
          sqlMessage: err.original.sqlMessage
        } : null
      } : undefined
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
