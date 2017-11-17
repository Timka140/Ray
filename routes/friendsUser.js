var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');
var renderDbUser = require("../User/renderDbUser.js");
var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var url = 'mongodb://127.0.0.1:27017/ray';
// addUserId
var body;
/* GET users listing. */
router.route("/").get((req,res,next)=> {
    // mongoClient.connect(url,(err,db)=>{
    //     var collection = db.collection("Friends");
    //     collection.find({addUserId:global.userID}).toArray((err,col)=>{
    //         db.close();
    //     });
    // })
}).post((req,res,next) =>{
    req.on("readable",()=>{
        body = req.read();
        body = JSON.parse(body);
        console.log(body);
        mongoClient.connect(url,(err,db)=>{
            var findCol = db.collection("FriendExpect");
                findCol.findOne({nick:body.nick},(err,col)=>{
                    if (col != null){
                        body = {
                            nick: col.nick,
                            name: col.name,
                            surname:col.surname,
                            idFriend: col.addUserId,
                            clientId: col.clientId
                        }
                        findCol.remove({nick:body.nick});
                        db.close();
                        addFriends(body);
                        addUserFriend(col.clientId,col.addUserId);
                    } else return;   
                });
        });
        function addFriends(body){
            console.log(body);
            mongoClient.connect(url,(err,db)=>{
                var insertCol = db.collection("Friends");
                insertCol.insertOne(body);

            });
        };
        function addUserFriend(user,addUserId){
            mongoClient.connect(url,(err,db)=>{
                var insertCol = db.collection("users");
                insertCol.findOne({_id:addUserId}, (err,col)=>{
                    if(err) throw err;
                    userFriend = {
                        nick:col.nick,
                        name:col.name,
                        surname: col.surname,
                        idFriend:user,
                        clientId:addUserId
                    }
                    insertUser(userFriend);
                });
                db.close();
            });
        }
        function insertUser(userFriend){
            mongoClient.connect(url,(err,db)=>{
                var insertCol = db.collection("Friends");
                insertCol.insertOne(userFriend);
                db.close();
            });
        }
    });
});
module.exports = router;