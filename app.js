const express = require('express');
const app = express();
const ExpressError = require('./utils/expressError.js');
const path = require('path');
const session = require('express-session')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const treksitesRoutes = require('./Routes/treksitesroutes.js')
const reviewRoutes = require('./Routes/reviewRoutes.js');
const userRoutes = require('./Routes/userRoutes.js');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/User.js');

mongoose.connect("mongodb://127.0.0.1:27017/trektales")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", () => {
    console.log("Database Connected!");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisisatopsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeuser', async (req, res) => {
//     const user = new User({ email: 'pranam@gmail.com', username: 'coltt' });
//     const newUser = await User.register(user, 'Chicken');
//     res.send(newUser);
// })

app.use('/', userRoutes);
app.use('/treksites', treksitesRoutes)
app.use('/treksites/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('show');
})

app.use('*', (req, res) => {
    throw new ExpressError('Page Not Found', 404)
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!";
    res.status(statusCode).render('error', {err});
})

app.listen(8080, () => {
    console.log("You are done!")
})