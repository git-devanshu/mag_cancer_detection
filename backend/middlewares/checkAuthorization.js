require('dotenv').config();
const jwt = require('jsonwebtoken');

const checkAuthorization = (req, res, next)=>{
    const token = req.headers.authorization;
    if(token){
        try{
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET);
            req.id = decoded.id;
            req.username = decoded.username;
            next();
        }
        catch(error){
            res.json({status : 401, message : 'Authorization Error'});
        }
    }
    else{
        res.json({status : 401, message : 'Authorization Error'});
    }
}

module.exports = {checkAuthorization};