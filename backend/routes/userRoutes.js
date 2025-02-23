const express = require('express');
const userRouter = express.Router();
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {getUserData, updateUserData, addRecords, addDoctorEmail, getUserRecommendations} = require('../controllers/userControllers');

// endpoint prefix : /users

userRouter.get('/user-data', checkAuthorization, getUserData);
userRouter.put('/update', checkAuthorization, updateUserData);
userRouter.get('/recommendations', checkAuthorization, getUserRecommendations);
userRouter.post('/add-records', checkAuthorization, addRecords);
userRouter.put('/add-doctor-email', checkAuthorization, addDoctorEmail);

module.exports = {userRouter};