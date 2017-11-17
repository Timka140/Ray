var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');
var renderDbUser = require("../User/renderDbUser.js");
var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/ray';

var modUser = require('../dbSheam/userShem.js').modUser;

var body;
function addFriQue(user,id,req) {
    mongoClient.connect(url,(err,db)=> {
        var collection = db.collection("FriendExpect");
        collection.insert(user);
        db.close();
    })
}
function checkFriend(user,mod){
    mongoClient.connect(url,(err,db)=> {
        var collection = db.collection("FriendExpect");
        collection.findOne({clientId:mod._id , addUserId:global.userID},(err,col)=>{
            if(err) throw err;
            if(col == null) {
                addFriQue(user);
            } else return;
        });
    });
}
/* GET users listing. */
router.route("/").post((req,res,next)=> {
    req.on("readable",()=>{
        body = req.read();
        body=JSON.parse(body);

        modUser.findOne({nick:RegExp("^"+body.nick,"i")},(err,mod)=>{
            if (err) throw console.log(err);
            var user;
                if(global.userID+"" == mod._id+""){
                    return;
                }else {
                    mongoClient.connect(url,(err,db)=> {
                        var collectionUser = db.collection("users");
                        collectionUser.findOne({_id:global.userID},(err,col)=>{
                            if(err) throw err;
                                user = {
                                    nick:col.nick,
                                    name: col.name,
                                    surname: col.surname,
                                    clientId: global.userID,
                                    addUserId: mod._id
                                }
                        });
                        var collection = db.collection("FriendExpect");
                        collection.findOne({clientId:global.userID, addUserId:mod._id},(err,col)=>{
                            if(err) throw err;
                            if(col == null) {
                                checkFriend(user,mod);
                            } else return;
                        });
                        db.close();
                    })
                }
        });
    })
});

module.exports = router;