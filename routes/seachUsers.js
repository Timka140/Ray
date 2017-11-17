var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/ray';
var modUser = require('../dbSheam/userShem.js').modUser;

var renderDbUser = require("../User/renderDbUser.js");
var resSeach;

/* GET users listing. */
router.route("/").get((req, res, next)=> {
        res.end(resSeach+"");
        resSeach = undefined;
}).post((req,res,next)=> {
    mongoClient.connect(url,(err,db)=> {
        var collection = db.collection("users");
        collection.findOne({_id:global.userID},(err,obj)=>{
            if (err) throw console.log(err);
            var seach = JSON.parse(req.read());
            console.log(seach,"На");
            modUser.find({nick:RegExp("^"+seach.seach,"gi")},(err,mod)=>{
                if (err) throw console.log(err);
                friend(mod,obj,seach);
                // res.get(resSeach)
            });
        });
        db.close();
        function friend(mod,obj,seach){
            mongoClient.connect(url,(err,db)=> {
            var friendsCol = db.collection("Friends");
                friendsCol.find({idFriend:global.userID}).toArray((err,col)=>{
                    if(err) throw err;
                    var user = []
                    for(var i=0; i<mod.length; i++) {
                        //Есть ошибка с другими пользователями
                        for(var j=0; j<col.length; j++) {
                            if (col[j].nick != mod[i].nick && mod[i].nick != obj.nick) {
                                user[i]= {
                                    nick:mod[i].nick,
                                    name: mod[i].name,
                                    surname: mod[i].surname
                                }
                            }else {
                                user[i] = undefined
                            }
                            console.log(col[j].nick,"col",obj.nick);
                        }
                        console.log(mod[i].nick,"mod")
                    }
                    console.log(typeof(col),col.length)
                    if (0 == col.length) {
                        for(var i=0; i<mod.length; i++) {
                            if (mod[i].nick != obj.nick) {
                                user[i]= {
                                    nick:mod[i].nick,
                                    name: mod[i].name,
                                    surname: mod[i].surname
                                }
                            }
                        }
                    }
                    console.log(user)
                    var resObjUser = {
                        name:obj.name,
                        surname:obj.surname,
                        nick:obj.nick,
                        state: obj.state,
                        users: user,
                        usersLenght: mod.length,
                        key: seach.key
                    };
                    resSeach = JSON.stringify(resObjUser)
                    console.log(resSeach);
                });
            })
        }
    });
});
;

module.exports = router;