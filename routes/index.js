var express = require('express');
var router = express.Router();


var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
var cookiePars = require('../User/cookiePars');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
   });
});

module.exports = router;
