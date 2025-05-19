require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectToDB = require('./database/db')
const authRoutes = require('./routes/auth-routes')
const homeRoutes = require('./routes/home-route')
const adminRoutes = require('./routes/admin-routes')
//middleware
app.use(express.json())

//calling database
connectToDB()

//routes
app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)


app.listen(PORT,() =>{
    console.log(`server is listening on port ${PORT}`);
    

})

