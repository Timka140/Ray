var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');
var renderDbUser = require("../User/renderDbUser.js");
var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var url = 'mongodb://127.0.0.1:27017/ray';
// addUserId

/* GET users listing. */
router.route("/").get((req,res,next)=> {
    mongoClient.connect(url,(err,db)=>{
        var collection = db.collection("FriendExpect");
        collection.find({addUserId:global.userID}).toArray((err,col)=>{
            // col= JSON.stringify(col[0]);
            db.close();
            // console.log(col);
            col = {
                users:col,
                usersLenght:col.length
            }
            console.log(col);
            res.send(col);
        });
    })
}).post((req,res,next) =>{
    req.on("readable",()=>{
        // console.log(req);
    })
});
module.exports = router;