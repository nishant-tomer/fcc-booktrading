var express = require("express"),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    helmet = require('helmet'),
    cookieParser = require('cookie-parser'),
    flash = require('req-flash'),
    assets = require("path").join(process.cwd(), "/assets"),
    views = require("path").join(process.cwd(), "/views");

var app = express()
require('dotenv').load()

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

app.set("views", views);
app.set("view engine", "jade");
app.use(express.static(assets))
app.use(express.logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(helmet())
app.use(session({
    secret: 'fcc-booktrading-secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash({ locals: 'flash' }))
app.use(passport.initialize());
app.use(passport.session());

require("./controllers/passport")(passport)
require("./routes")(app,passport)


app.listen(process.env.PORT || 8080)
