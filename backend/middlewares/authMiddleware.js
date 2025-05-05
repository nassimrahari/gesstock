
require('dotenv').config(); // At the top of your file
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {



    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const user = await prisma.user.findUnique({ where: { id: Number(userId) }});

    if(!user){
        return res.status(401).json({ message: 'user not found' });
    }
    req.auth = {
      userId: userId,
      user: user
    };
    // console.log(user.email,user.isAdmin);
    next();

  } catch (error) {
    console.log('error',error);
    res.status(401).json({ error: 'Unauthorized' });
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