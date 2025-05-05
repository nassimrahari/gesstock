const express = require('express');
const {
    register,
    login,
    checkAuth,
    changePassword,
    requestPasswordReset,
    resetPassword,
    fetchProfileDetails, // Import the new function
    updateProfileDetails // Import the new function
} = require('../controllers/authController'); // Import the new functions
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Route for registration
router.post('/register', register);

// Route for login
router.post('/login', login);

// Route to check authentication
router.get('/checkauth', checkAuth);

// Route to change password
router.put('/change-password', authMiddleware, changePassword);

// Route to request a password reset
router.post('/request-password-reset', requestPasswordReset);

// Route to reset password
router.post('/reset-password', resetPassword);

// New route to fetch user profile details
router.get('/change-profile', authMiddleware, fetchProfileDetails); // Add this route

// New route to update user profile details
router.put('/change-profile', authMiddleware, updateProfileDetails); // Add this route

module.exports = router;