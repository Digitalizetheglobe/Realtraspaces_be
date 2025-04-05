const Blog = require('../models/blog.model');
const slugify = require('slugify');

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
        try {
            const blog = await Blog.findByPk(id);
            if (!blog) {
                return { success: false, error: 'Blog not found' };
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

            await blog.update(blogData);
            return { success: true, data: blog };
        } catch (error) {
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
            await blog.destroy();
            return { success: true, message: 'Blog deleted successfully' };
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