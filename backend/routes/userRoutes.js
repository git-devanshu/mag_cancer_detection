const express = require('express');
const userRouter = express.Router();
const {checkAuthorization} = require('../middlewares/checkAuthorization');
const {getUserData, updateUserData, addRecords, sendReportToDoctor} = require('../controllers/userControllers');

// endpoint prefix : /user

userRouter.get('/user-data', checkAuthorization, getUserData);
userRouter.put('/update', checkAuthorization, updateUserData);
userRouter.post('/add-records', checkAuthorization, addRecords);
userRouter.post('/send-records', checkAuthorization, sendReportToDoctor);

module.exports = {userRouter};