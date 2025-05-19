require('dotenv').config
const mongoose = require('mongoose');

const connectToDB = async() =>{
    try{
        await mongoose.connect('mongodb+srv://namratagitenew_auth:namratagitenew_auth2001@cluster0.p5tysjr.mongodb.net/')
        console.log('Mongodb connection successful.');
        


    }catch(e){
        console.log('Mongodb connection failed!!');
        
    }
}

module.exports = connectToDB