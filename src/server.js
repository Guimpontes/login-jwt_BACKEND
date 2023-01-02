const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const routers = require('../routers/routers');
require('dotenv').config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGOOSE_URL_CONNECTION, () => {
    console.log('Mongoose connected')
})

app.use(cors());
app.use(express.json())
app.use("/api", routers );

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})