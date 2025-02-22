const {User} = require('../models/user');
const {Record} = require('../models/records');

const getUserData = async(req, res) =>{
    try{
        const data = await User.findById({_id : req.id}).populate('pastRecords');
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({ message : 'Internal Server Error' });
    }
}

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

const sendReportToDoctor = async(req, res) =>{
    // try{
    //     const 
    // }
    // catch(error){
    //     res.status(500).json({ message : 'Internal Server Error' });
    // }
}

module.exports = {getUserData, updateUserData, addRecords, sendReportToDoctor};