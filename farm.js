const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/farm');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("Database Connected");
})

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ["Winter", "Summer", "Spring", "Monsoon"]
    }
})

const Product = mongoose.model('Product', productSchema);

const framSchema = mongoose.Schema({
    name: String,
    location: String,
    product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

const Farm = mongoose.model('Farm', framSchema);

async function makeFarm() {
    const newFarm = new Farm({ name: "Paras Farm", location: "Gohad" });
    const pro = await Product.findOne({ name: "Mango" });
    newFarm.product.push(pro);
    await newFarm.save();
    console.log(newFarm);
}

async function makeProduct() {
    await Product.insertMany([
        {name: "Mango", price: 30, season: "Summer"},
        {name: "Strawberry", price: 57, season: "Winter"},
        {name: "Watermelon", price: 20, season: "Summer"},
    ])
}

const addProduct = async () => {
    const fa = await Farm.findOne({ name: "Paras Farm" }).populate('product');
    // const pro = await Product.findOne({ name: "Watermelon" });
    // fa.product.push(pro);
    // await fa.save();
    console.log(fa.product);
}

addProduct().then(() => mongoose.connection.close())