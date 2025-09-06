const express = require('express');
const { signup, login, googleOAuth, refreshToken } = require('../controllers/authController');
const {authMiddleware} = require('../middleware/auth.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login)
router.get('/home', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
});
router.post('/google-login', googleOAuth);
router.post('/refresh', refreshToken);

module.exports = router;
