require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT;

const setupSwagger = require('./utils/swagger');


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

// 2) Setup Swagger
setupSwagger(app);

// 3) ROUTES
app.use('/v1/api/admin', adminRoute);
app.use('/v1/api/instructor', instructorRoute);
app.use('/v1/api/student', studentRoute);
app.use('/v1/api/review', reviewRoute);
app.use('/v1/api/course', courseRoute);
app.use('/v1/api/category', categoryRoute);


app.listen(PORT, ()=> console.log(`app listing in port ${PORT}`));