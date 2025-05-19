

const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next)=>{

    const authHeader = req.headers['authorization'];
    console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided!!"
        })
    }

    //decode the token
    //we are basically matching existing user info to the credentials typed by 
    //new user who is trying to accessing and this matching happens using token that created with the user loggin
    try{
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedTokenInfo);

        req.userInfo = decodedTokenInfo;
        next()
        
    }catch(e){
        return res.status(500).json({
            success:false,
            message: "Access denied. No token provided!!"
        })
    }
    
}

module.exports = authMiddleware