const express = require('express');
const authRouter = express.Router();
const {signupUser, loginUser, forgotPassword, resetPassword} = require('../controllers/authControllers');

// path prefix : /user

authRouter.post('/signup', signupUser);
authRouter.put('/login', loginUser);
authRouter.put('/forgot-password/:username', forgotPassword);
authRouter.put('/reset-password/:username', resetPassword);

module.exports = {authRouter};