const {User} = require('../models/user');
const {Record} = require('../models/records');

// @desc get users data
// @route POST /users/get-data
// @access private
const getUserData = async(req, res) =>{
    try{
        const data = await User.findById({_id : req.id}).populate('pastRecords');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc update users data
// @route POST /users/update
// @access private
const updateUserData = async(req, res) =>{
    try{
        const {name, dateOfBirth, gender} = req.body;
        const data = await User.findByIdAndUpdate({_id : req.id}, {name, dateOfBirth, gender}, {new: true});
        if(data){
            res.status(200).json({message : 'User Data Updated Successfully'});
        }
        else{
            res.status(400).json({message : 'Failed to Update User Data'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc add new test records
// @route POST /users/add-records
// @access private
const addRecords = async(req, res) =>{
    try{
        const {imageURL, testDate, category, confidence} = req.body;
        const newRecord = new Record({
            imageURL,
            testDate,
            category,
            confidence
        });
        const data = await newRecord.save();
        const user = await User.findById({_id : req.id});
        user.pastRecords.push(data._id);
        await user.save();
        res.status(200).json({message : 'Record Added Successfully'});
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc add doctor email
// @route POST /users/add-doctor-email
// @access private
const addDoctorEmail = async (req, res) =>{
    try{
        const {doctorEmail} = req.body;
        const data = await User.findByIdAndUpdate({_id : req.id}, {doctorEmail});
        if(data){
            res.status(200).json({message : 'Doctor Email Updated Successfully'});
        }
        else{
            res.status(400).json({message : 'Failed to Update Doctor Email'});
        }
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

// @desc send test report pdf to doctor on email
// @route POST /users/send-records
// @access private
const sendReportToDoctor = async (req, res) =>{
    // try{
    //     const 
    // }
    // catch(error){
    //     res.status(500).json({ message : 'Internal Server Error' });
    // }
}

module.exports = {getUserData, updateUserData, addRecords, sendReportToDoctor, addDoctorEmail};