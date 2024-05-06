const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treksiteSchema = new Schema({
    title: String,
    description: String,
    location: String,
    price: Number
})

module.exports = mongoose.model('Treksite', treksiteSchema);