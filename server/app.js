require('dotenv').config()

const path = require('path');
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
const PORT = 4500

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("error", (error) => {
    console.error(error)
});
db.once("open", () => {
    console.log("Connected to DB");
});

const allowedOrigins = ["*"];
const methods = [
    "GET",
    "PUT",
    "POST",
    "PATCH",
    "UPDATE",
    "HEAD",
    "OPTIONS",
    "DELETE",
];
const headers = ["*"]
app.use(
    cors({
        origin: allowedOrigins,
        methods: methods,
        headers: headers,
    })
);
const PUBLIC = '../client/views/'

// static pages

// -/home
app.get('/hbh/home', (req, res, next) => {
    res.sendFile(path.join(__dirname, PUBLIC, 'home.html'))
})

// users router
const u_router = require('./routes/userrouter')
app.use('/hbh/api/users', u_router)

// stories router
const s_router = require('./routes/storyrouter')

app.use('/hbh/api/stories', s_router)

app.get('/hbh/api/test', (req, res) => {
    console.log('Test call')
    res.send('Test')
})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:4500/hbh/api`)
})