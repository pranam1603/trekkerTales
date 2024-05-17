const mongoose = require('mongoose');
const Review = require('./Review');
const Schema = mongoose.Schema;

const treksiteSchema = new Schema({
    title: String,
    description: String,
    location: String,
    price: Number,
    image: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

treksiteSchema.post('findOneAndDelete', async function (deltrek) {
    if (deltrek) {
        await Review.deleteMany({
            _id: {
                $in: deltrek.reviews
            }
        })
    }
})

module.exports = mongoose.model('Treksite', treksiteSchema);