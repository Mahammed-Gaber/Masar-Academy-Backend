require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.listen(()=> console.log(`App lisining on port ${PORT}`))