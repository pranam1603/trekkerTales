const express = require('express');
const app = express();
const path = require('path');
const Treksite = require('./models/Treksite')
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/trektales")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => {
    console.log("Database Connected!");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('show');
})

app.get('/treksites', async(req, res) => {
    const alltreks = await Treksite.find({});
    res.render('Treksites/index', { alltreks });
})

app.get('/treksites/new', async (req, res) => {
    res.render('Treksites/new')
})

app.post('/treksites', async (req, res) => {
    const treksite = new Treksite(req.body);
    await treksite.save();
    res.redirect(`/treksites/${treksite._id}`)
})

app.get('/treksites/:id', async(req, res) => {
    const treksite = await Treksite.findById(req.params.id);
    res.render('Treksites/show', { treksite });
})



app.listen(8080, () => {
    console.log("You are done!")
})