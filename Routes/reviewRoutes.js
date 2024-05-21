const express = require('express');
const Router = express.Router({mergeParams: true})
const ExpressError = require('../utils/expressError.js');
const catchAsync = require('../utils/asyncError.js');

const { joiReviewSchema } = require('../schema');
const Review = require('../models/Review');
const Treksite = require('../models/Treksite');


const validateReview = (req, res, next) => {
    const { error } = joiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
Router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const review = new Review({ rating: req.body.rating, body: req.body.review })
    const trek = await Treksite.findById(req.params.id);
    trek.reviews.push(review);
    await review.save();
    await trek.save();
    req.flash('success', "Review Created Successfully!")
    res.redirect(`/treksites/${trek._id}`)
}))

Router.delete('/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Treksite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', "Review Deleted Successfully!")
    res.redirect(`/treksites/${id}`);
}))

module.exports = Router