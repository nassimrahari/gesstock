require('dotenv').config(); // At the top of your file
//authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');



const crypto = require('crypto');
const { sendResetEmail } = require('../services/emailService'); // Service to send emails


const prisma = new PrismaClient();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    console.log(req.body)

    // Vérifiez que le mot de passe est défini et non vide
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        
        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user });
    } catch (error) {
        console.error(error); // Log l'erreur pour le débogage
        res.status(500).send('Internal server error');
    }
};

// Méthode de déconnexion
exports.logout = (req, res) => {
    // Ici, vous pouvez supprimer le token du client ou gérer la session selon vos besoins.
    // Dans le cas d'une API stateless, il n'est pas nécessaire de faire quoi que ce soit.
    res.status(200).json({ message: 'Logout successful' });
};

// Méthode pour vérifier l'authentification de l'utilisateur
exports.checkAuth = async (req, res) => {

    try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const user = await prisma.user.findUnique({ where: { id: Number(userId) }});
    
        if(!user){
            return res.status(401).json({ message: 'user not found' });
        }

        res.status(200).json({ user }); // Retourner les détails de l'utilisateur
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};


exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirmation do not match' });
    }

    try {
        // Get the user from the request (middleware should set req.auth)
        const userId = req.auth.userId;
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await prisma.user.update({
            where: { id: Number(userId) },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};







// Request password reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Generate a token
    const token = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log(email);
    // Save token and expiration to the database
    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: resetTokenExpiry, // Use the Date object
        },
    });

    // Send email (implement sendResetEmail logic)
    await sendResetEmail(user.email, token);
    res.status(200).json({ message: 'Password reset email sent' });
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gte: new Date(Date.now()) },
        },
    });

    if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear the reset token
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    res.status(200).json({ message: 'Password reset successfully' });
};



// Function to fetch user profile details
exports.fetchProfileDetails = async (req, res) => {
    try {
        const userId = req.auth.userId; // Assuming you have middleware that sets req.auth.userId
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return relevant user details (omit sensitive information)
        const { password, resetToken, resetTokenExpiry, ...profileData } = user;
        res.status(200).json(profileData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to update user profile details
exports.updateProfileDetails = async (req, res) => {
    const { username, email, work } = req.body;

    try {
        const userId = req.auth.userId; // Assuming you have middleware that sets req.auth.userId
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user details
        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                username,
                email,
                work,
            },
        });

        // Return updated user details (omit sensitive information)
        const { password, resetToken, resetTokenExpiry, ...profileData } = updatedUser;
        res.status(200).json(profileData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};