const express = require('express');
const userRouter = express.Router();
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {getUserData, updateUserData, addRecords, sendReportToDoctor, addDoctorEmail} = require('../controllers/userControllers');

// endpoint prefix : /user

userRouter.get('/user-data', checkAuthorization, getUserData);
userRouter.put('/update', checkAuthorization, updateUserData);
userRouter.post('/add-records', checkAuthorization, addRecords);
userRouter.post('/send-records', checkAuthorization, sendReportToDoctor);
userRouter.post('/add-doctor-email', checkAuthorization, addDoctorEmail);

module.exports = {userRouter};