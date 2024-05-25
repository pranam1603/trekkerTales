const express = require('express');
const ExpressError = require('../utils/expressError.js');
const catchAsync = require('../utils/asyncError.js');
const { isLogin } = require('../middleware');

const { joiTreksitesSchema } = require('../schema');
const Treksite = require('../models/Treksite');
const Router = express.Router()

const validateSchema = (req, res, next) => {
    const { error } = joiTreksitesSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

Router.get('/', catchAsync(async (req, res) => {
    const alltreks = await Treksite.find({});
    res.render('Treksites/index', {alltreks});
}))

Router.get('/new', isLogin, catchAsync(async (req, res) => {
    res.render('Treksites/new')
}))

Router.post('/',validateSchema, catchAsync(async (req, res) => {
    const treksite = new Treksite(req.body);
    await treksite.save();
    req.flash('success', "Treksite Created Successfully!")
    res.redirect(`/treksites/${treksite._id}`)
}))

Router.get('/:id', catchAsync(async (req, res, next) => {
    const treksite = await Treksite.findById(req.params.id).populate('reviews');
    if (!treksite) {
        req.flash('error', 'Cannot find that Treksite!')
        return res.redirect('/treksites');
    }
    res.render('Treksites/show', {treksite})
}))

Router.get('/:id/edit', catchAsync(async (req, res) => {
    const treksite = await Treksite.findById(req.params.id);
    if (!treksite) {
        req.flash('error', 'Cannot find that Treksite!')
        return res.redirect('/treksites');
    }
    res.render('Treksites/edit', {treksite});
}))

Router.put('/:id', validateSchema,catchAsync(async (req, res) => {
    const treksite = await Treksite.findByIdAndUpdate(req.params.id, {
        image: req.body.image,
        description: req.body.description,
        title: req.body.title,
        location: req.body.location,
        price: req.body.price
    })
    req.flash('success', "Treksite Updated Successfully!")
    res.redirect(`/treksites/${treksite.id}`);
}))

Router.delete('/:id', catchAsync(async (req, res) => {
    await Treksite.findByIdAndDelete(req.params.id);
    req.flash('success', "Treksite Deleted Successfully!")
    res.redirect("/treksites");
}))

module.exports = Router;