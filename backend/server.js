const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {connectToDB} = require('./configs/dbConfig');
const {authRouter} = require('./routes/authRoutes');
const { userRouter } = require('./routes/userRoutes');

// express app
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// connect to DB
connectToDB();

// routes
app.use('/user', authRouter); // user authentication routes
app.use('/user', userRouter); // user functionality routes

// Run the server
app.listen(process.env.PORT, ()=> {
    console.log('Server is running on PORT : ', process.env.PORT);
});