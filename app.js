const express = require('express');
const app = express();
const ExpressError = require('./utils/expressError.js');
const path = require('path');
const Treksite = require('./models/Treksite')
const Review = require('./models/Review.js')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/asyncError.js');
const methodOverride = require('method-override');
const {joiTreksitesSchema, joiReviewSchema} = require('./schema.js');

mongoose.connect("mongodb://127.0.0.1:27017/trektales")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => {
    console.log("Database Connected!");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));

const validateSchema = (req, res, next) => {
    const { error } = joiTreksitesSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = joiReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('show');
})

app.get('/treksites', catchAsync(async (req, res) => {
    const alltreks = await Treksite.find({});
    res.render('Treksites/index', {
        alltreks
    });
}))

app.get('/treksites/new', catchAsync(async (req, res) => {
    res.render('Treksites/new')
}))

app.post('/treksites',validateSchema, catchAsync(async (req, res) => {
    const treksite = new Treksite(req.body);
    await treksite.save();
    res.redirect(`/treksites/${treksite._id}`)
}))

app.get('/treksites/:id', catchAsync(async (req, res, next) => {
    const treksite = await Treksite.findById(req.params.id).populate('reviews');
    res.render('Treksites/show', {
        treksite
    })
}))

app.get('/treksites/:id/edit', catchAsync(async (req, res) => {
    const treksite = await Treksite.findById(req.params.id);
    res.render('Treksites/edit', {
        treksite
    });
}))

app.put('/treksites/:id', validateSchema,catchAsync(async (req, res) => {
    const treksite = await Treksite.findByIdAndUpdate(req.params.id, {
        image: req.body.image,
        description: req.body.description,
        title: req.body.title,
        location: req.body.location,
        price: req.body.price
    })
    res.redirect(`/treksites/${treksite.id}`);
}))

app.delete('/treksites/:id', catchAsync(async (req, res) => {
    await Treksite.findByIdAndDelete(req.params.id);
    res.redirect("/treksites");
}))

app.post('/treksites/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    const review = new Review({ rating: req.body.rating, body: req.body.review })
    const trek = await Treksite.findById(req.params.id);
    trek.reviews.push(review);
    await review.save();
    await trek.save();
    res.redirect(`/treksites/${trek._id}`)
}))

app.delete('/treksites/:id/review/:reviewId', catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Treksite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/treksites/${id}`);
}))

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!";
    res.status(statusCode).render('error', {err});
})

app.listen(8080, () => {
    console.log("You are done!")
})