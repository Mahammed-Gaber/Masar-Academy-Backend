require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;


const adminRoute = require('./routes/adminRoute');
const instructorRoute = require('./routes/instructorRoute');
const studentRoute = require('./routes/studentRoute');
const reviewRoute = require('./routes/reviewRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');


mongoose.connect(process.env.DATABASE_URL).then(()=> {
    console.log('Database Connected...')
}).catch(err => {
    console.log(err);
})

// 1) GLOBAL MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// 2) ROUTES
app.use('/api/admin', adminRoute);
app.use('/api/instructor', instructorRoute);
app.use('/api/student', studentRoute);
app.use('/api/review', reviewRoute);
app.use('/api/course', courseRoute);
app.use('/api/category', categoryRoute);


app.listen(PORT, ()=> console.log(`app listing in port ${PORT}`));