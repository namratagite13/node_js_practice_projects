require('dotenv').config()
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const registerUser = async(req,res) =>{
    try{
        //extracting userinfo from reg body
        const {username, email, password, role} = req.body;

        //checking if user is already in database
        //or  allows you to specify multiple conditions, and the query will return documents that match any of those conditions.
        const checkIfUserAlreadyExist = await User.findOne({$or: [{username}, {password}]});

        if(checkIfUserAlreadyExist){
            //return This keyword immediately stops the execution of the current function and sends the specified 
            // value back to the caller. In this context, it's sending an HTTP response back to the client that made the request.
            return res.status(400).json({
                success: false,
                message: 'user is already exist either with same password or with same username!!'
            })
        }

        //hashing password
        //gensalt() – It is used to generate salt. Salt is a pseudorandom string that is added to the password. 
        //Since hashing always gives the same output for the same input so if someone has access to the database, 
        // hashing can be defeated. for that salt is added at end of the password before hashing.

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //create new user
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
            
        })
        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success: true,
                message: 'User created successfully!!!'
            })
        }else{
            res.status(400).json({
                success:false,
                message:"Unable to register user please try again later!!"
            })
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message:"Something went wrong, please try again!!"
        })

    }
}


const loginUser = async(req,res) =>{
    try{
        //requesting username and password for login 
        const { username, password } = req.body;

        //finding if current user existing in database
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                success:false,
                message:  "Invalid Credentials!!"
            })
        }

        //comparing passwords
        const isPasswordCorrect  = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message: "Invalid Credentials!!"
            })
        }


        //creating token
        const accessToken = jwt.sign({
            userId : user._id,
            username: user.username,
            role : user.role
        }, process.env.JWT_SECRET,{
            expiresIn: '15m'
        })


        res.status(200).json({
            success: true,
            message: "Logged in successfully!!"
        })
        
        
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message:"Something went wrong, please try again!!"
        })
        

    }
}

module.exports = { registerUser, loginUser}