
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var newUserDb = require('../dbSheam/userShem.js').userInfoDB;
var sheamUserDb = require('../dbSheam/userShem.js').modUser;
module.exports = (app) => {
    app.use(session({
    secret:"xl2k6sp91cda",
    key: "sid",
    cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
    },
        store: new MongoStore({ mongooseConnection: mongoose.connection})
    }));
}