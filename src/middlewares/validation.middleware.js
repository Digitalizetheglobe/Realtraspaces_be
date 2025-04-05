const validateUser = (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Name, email, and password are required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid email format'
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

const validateUpdateUser = (req, res, next) => {
    const { name, email, password } = req.body;

    // At least one field should be present for update
    if (!name && !email && !password) {
        return res.status(400).json({
            status: 'error',
            message: 'At least one field (name, email, or password) is required for update'
        });
    }

    // If email is provided, validate its format
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format'
            });
        }
    }

    // If password is provided, validate its length
    if (password && password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 6 characters long'
        });
    }

    next();
};

module.exports = {
    validateUser,
    validateUpdateUser
}; 