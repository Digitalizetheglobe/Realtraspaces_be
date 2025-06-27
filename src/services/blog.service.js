const Blog = require('../models/blog.model');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs/promises');

// Helper function to get the full path to the uploads directory
const getUploadsDir = () => {
    return path.join(__dirname, '../../public/blogImages');
};

// Helper function to get the full path of an uploaded file
const getFilePath = (filename) => {
    return path.join(getUploadsDir(), filename);
};

class BlogService {
    // Create a new blog
    async createBlog(blogData) {
        try {
            // Generate slug from title
            blogData.slug = slugify(blogData.blogTitle, { lower: true });
            
            // Handle dynamic fields
            if (blogData.dynamicFields) {
                blogData.dynamicFields = this.validateDynamicFields(
                    blogData.dynamicFields,
                    blogData.fieldSchema
                );
            }

            const blog = await Blog.create(blogData);
            return { success: true, data: blog };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update field schema
    async updateFieldSchema(schema) {
        try {
            // Update schema for all blogs
            await Blog.update(
                { fieldSchema: schema },
                { where: {} }
            );
            return { success: true, message: 'Field schema updated successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get all blogs
    async getAllBlogs() {
        try {
            const blogs = await Blog.findAll();
            return { success: true, data: blogs };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get blog by ID
    async getBlogById(id) {
        try {
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return { success: false, error: 'Blog not found' };
            }
            return { success: true, data: blog };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Update blog
    async updateBlog(id, blogData) {
        let oldImages = [];
        let transaction;
        
        try {
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return { success: false, error: 'Blog not found' };
            }
            
            // Store old images for cleanup if update is successful
            if (blog.blogImages && blog.blogImages.length > 0) {
                oldImages = [...blog.blogImages];
            }

            // Update slug if title changed
            if (blogData.blogTitle && blogData.blogTitle !== blog.blogTitle) {
                blogData.slug = slugify(blogData.blogTitle, { lower: true });
            }

            // Handle dynamic fields
            if (blogData.dynamicFields) {
                blogData.dynamicFields = this.validateDynamicFields(
                    blogData.dynamicFields,
                    blog.fieldSchema
                );
            }
            
            // If new images are provided, merge with existing ones if needed
            if (blogData.blogImages && blogData.blogImages.length > 0) {
                // If you want to replace all images:
                // Just use the new images, old ones will be cleaned up
                
                // If you want to append new images to existing ones:
                // blogData.blogImages = [...(blog.blogImages || []), ...blogData.blogImages];
            } else if (blogData.blogImages === null || blogData.blogImages === undefined) {
                // If blogImages is explicitly set to null/undefined, keep the existing images
                delete blogData.blogImages;
            }

            await blog.update(blogData);
            
            // Clean up old images if update was successful
            if (oldImages.length > 0) {
                await this.cleanupImages(oldImages);
            }
            
            return { success: true, data: blog };
        } catch (error) {
            // If there was an error, clean up any newly uploaded images
            if (blogData.blogImages && blogData.blogImages.length > 0) {
                await this.cleanupImages(blogData.blogImages);
            }
            return { success: false, error: error.message };
        }
    }

    // Delete blog
    async deleteBlog(id) {
        try {
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return { success: false, error: 'Blog not found' };
            }
            
            // Delete associated images
            if (blog.blogImages && blog.blogImages.length > 0) {
                await this.cleanupImages(blog.blogImages);
            }
            
            await blog.destroy();
            return { success: true, message: 'Blog deleted successfully' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Clean up uploaded images
    async cleanupImages(filenames) {
        try {
            if (!Array.isArray(filenames)) {
                filenames = [filenames];
            }
            
            const deletePromises = filenames.map(async (filename) => {
                if (!filename) return;
                try {
                    const filePath = getFilePath(filename);
                    await fs.unlink(filePath).catch(() => {});
                } catch (error) {
                    console.error(`Error deleting file ${filename}:`, error);
                }
            });
            
            await Promise.all(deletePromises);
            return true;
        } catch (error) {
            console.error('Error cleaning up images:', error);
            return false;
        }
    }

    // Get blog by slug
    async getBlogBySlug(slug) {
        try {
            const blog = await Blog.findOne({ where: { slug } });
            if (!blog) {
                return { success: false, error: 'Blog not found' };
            }
            return { success: true, data: blog };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Validate dynamic fields against schema
    validateDynamicFields(fields, schema) {
        if (!schema) return fields;

        const validatedFields = {};
        for (const [key, value] of Object.entries(fields)) {
            if (schema[key]) {
                // Validate based on schema type
                switch (schema[key].type) {
                    case 'string':
                        validatedFields[key] = String(value);
                        break;
                    case 'number':
                        validatedFields[key] = Number(value);
                        break;
                    case 'boolean':
                        validatedFields[key] = Boolean(value);
                        break;
                    case 'array':
                        validatedFields[key] = Array.isArray(value) ? value : [value];
                        break;
                    default:
                        validatedFields[key] = value;
                }
            }
        }
        return validatedFields;
    }

    // Get blog by slug
    async getBlogBySlug(slug) {
        try {
            const blog = await Blog.findOne({ where: { slug } });
            if (!blog) {
                return { success: false, error: 'Blog not found' };
            }
            return { success: true, data: blog };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new BlogService(); 