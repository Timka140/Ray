var express = require('express');
var router = express.Router();

var renderDbUser = require("../User/renderDbUser.js");

/* GET users listing. */
router.route("/").get((req, res, next)=> {
    // res.send(global.userID);
    // console.log(global.userID, " id");
    renderDbUser("user","home",req,res);
}).post((req,res,next)=> {

});

module.exports = router;
