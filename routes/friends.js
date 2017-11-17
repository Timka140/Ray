var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/ray';
var modUser = require('../dbSheam/userShem.js').modUser;

var renderDbUser = require("../User/renderDbUser.js");
var resSeach,user;

router.route("/").get((req, res, next)=> {
    mongoClient.connect(url,(err,db)=>{
        var userCol = db.collection("users");
        userCol.findOne({_id:global.userID},(err,col)=>{
            if(err) throw err;
            user = {
                name:col.name,
                surname:col.surname,
                nick:col.nick,
                state:col.state
            }
        });
        var collection = db.collection("Friends");
        collection.find({idFriend:global.userID}).toArray((err,col)=>{
            db.close();
            col = {
                users:col,
                usersLenght:col.length
            }
            console.log(col);
            res.render("freinds",{
                title: "Freinds",
                friends: col,
                name:user.name,
                surname:user.surname,
                nick:user.nick
            });
        });
    })
}).post((req,res,next)=> {
    mongoClient.connect(url,(err,db)=> {
        var collection = db.collection("users");
        collection.findOne({_id:global.userID},(err,obj)=>{
            if (err) throw console.log(err);
            modUser.find({nick:RegExp("^"+req.read(),"gi")},(err,mod)=>{
                if (err) throw console.log(err);
                var user = []
                for(var i=0; i<mod.length; i++) {
                    user[i]= {
                        nick:mod[i].nick,
                        name: mod[i].name,
                        surname: mod[i].surname
                    }
                }
                var resObjUser = {
                    title: "Freinds",
                    name:obj.name,
                    surname:obj.surname,
                    nick:obj.nick,
                    state: obj.state,
                    users: user,
                    usersLenght: mod.length,
                };
                resSeach = JSON.stringify(resObjUser);
            });
        });
        db.close();
    });
});

module.exports = router;