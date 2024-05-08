const mongoose = require('mongoose');
const { descriptors, places } = require('./seedHelper');
const Treksite = require('../models/Treksite');
const cities = require('./cities');

mongoose.connect("mongodb://127.0.0.1:27017/trektales")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => {
    console.log("Database Connected!");
})

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Treksite.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const trek = new Treksite({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.floor(Math.random() * 100),
            image: "https://source.unsplash.com/random/?Cryptocurrency&1",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
        })
        await trek.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})