const express = require('express');
const Router = express.Router();
const catchAsync = require('../utils/asyncError.js');
const User = require('../models/User.js');
const passport = require('passport');


Router.get('/register', catchAsync(async (req, res) => {
    res.render('User/register')
}))

Router.post('/register', catchAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newuser = await User.register(user, password);
    req.login(newuser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Welcome to Treksite!');
        res.redirect('/treksites');
    });
}))

Router.get('/login', catchAsync(async (req, res) => {
    res.render('User/login')
}))

Router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', "Welcome Back!");
    res.redirect('/treksites');
})

Router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', "GoodBye!");
        res.redirect('/treksites');
    });
})

module.exports = Router;
