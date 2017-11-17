var express = require('express');
var router = express.Router();
var mongoClien = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;
var urlDb = 'mongodb://127.0.0.1:27017/ray';
function resRenderRoom(colUser,res,room){
        if (roomLenght == undefined) {
            var roomLenght = 0;
        } else {
            var roomLenght = colUser.rooms.lengt;
        }
        res.render("messages",{
            name:colUser.name,
            surname:colUser.surname,
            nick:colUser.nick,
            length:roomLenght,
            rooms: room
        });
    }
// function friendSeachRoom(colUser,res,db){
//         var collection = db.collection('room');
//         collection.find({friendID:colUser._id}).toArray((err,col)=>{
//             if (err) throw err;
//             console.log(col, "Условие 2");
//             var room  = new Array;
//             var lastMessage;
//             for(var i=0; i<col.length;i++){
//                 try {
//                     lastMessage = col[i].messages[col[i].messages.length-1].message;
//                 } catch (err) {
//                     lastMessage = "";
//                 }
//                 room[i] = {
//                     _id:col[i]._id,
//                     nick:col[i].userNick,
//                     name:col[i].userName,
//                     surname:col[i].userSurname,
//                     message:lastMessage
//                 }
//             }
//             db.close();
//             console.log(room,"Комнаты");
//             resRenderRoom(colUser,res,room);
//         });
// }
function sechFriend(colUser,db,i,collection,room) {
    collection.findOne({friendID:colUser._id},(err,col)=>{
        // console.log(col,"Условие");
    if (err) throw err;
        room.push({
            _id:col._id,
            nick:col.userNick,
            name:col.userName,
            surname:col.userSurname,
            message:col.messages[col.messages.length-1].message
        })
    // console.log(room, "Условие");
    });
    return room;
}
//Нашёл ошибку разные поля для поиска user и friend
//Находит всех user а friend null
function renderRoom(colUser,res,db,lengthRoom){
    var room  = new Array;
        var collection = db.collection('room');
        for(var i=0; i< lengthRoom;i++){
            collection.findOne({_id:colUser.rooms[i]},(err,col)=>{
                if (err) throw err;
                    room.push({
                        _id:col._id,
                        nick:col.friendNick,
                        name:col.friendName,
                        surname:col.friendSurname,
                        message:col.messages[col.messages.length-1].message
                    });
                    if (lengthRoom == i ) {
                        db.close();
                        resRenderRoom(colUser,res,room);
                        console.log("_________________________");
                        console.log(room,"Конец функции",lengthRoom);
                        return;
                    }
            });
        }
}

function insertRoom(user,friend,userID,res,db){
        var idRoom = new ObjectID();
        var collection = db.collection("room");
        collection.insertOne({
            userName:user.name,
            userSurname: user.surname,
            userNick: user.nick,
            userID:userID,
            friendName: friend.name,
            friendSurname:friend.surname,
            friendNick:friend.nick,
            friendID:friend.id,
            _id:idRoom,
        });
        db.close();
}
function endRoom(res,userID,friend) {
    mongoClien.connect(urlDb,(err,db)=>{
        if (err) throw err;
        var collection = db.collection("room");
        collection.findOne({userID:userID,friendID:friend.id},(err,col)=>{
            if (err) throw err;
            var id = JSON.stringify({id:col._id});
            res.end(id);
        });
        db.close();
    });
}
function checkRoomFriend(user,friend,userID,res,db){
        var collection = db.collection("room");
        collection.findOne({userNick:friend.nick,friendNick:user.nick},(err,col)=>{
            if (err) throw err;
            if (col == null) {
                insertRoom(user,friend,userID,res,db);
            } else {
                return;
                db.close();
            }
        });
}
// Доделать эту дрянь
// Ошибка создания комнаты
function checkRoomUser(user,friend,userID,res,db){
        var collection = db.collection("room");
        collection.findOne({userNick:user.nick,friendNick:friend.nick},(err,col)=>{
            if (err) throw err;
            if (col == null) {
                checkRoomFriend(user,friend,userID,res,db);
            } else {
                return;
                db.close();
            } 
    });
}
function userSeach(friend,userID,res,db){
        var collection = db.collection("users");
        collection.findOne({_id: global.userID},(err,col)=>{
            var user = {
                name:col.name,
                surname:col.surname,
                nick:col.nick,
                id: col._id
            }
            checkRoomUser(user,friend,userID,res,db);
        });
}
function seachFriend(body,userID,res,db){
        var collection = db.collection("users");
        collection.findOne({nick: body.nickFriend},(err,col)=>{
            var friend = {
                name:col.name,
                surname:col.surname,
                nick:col.nick,
                id: col._id
            }
            userSeach(friend,userID,res,db);
        });
}
function seachRoom (db,collection,body,res,userID) {
    collection.findOne({userID:userID, friendNick:body.nickFriend},(err,col)=>{
        if (err) throw err;
        if (col == null){
            seachFriend(body,userID,res,db);
        } else {
            idRoom = JSON.stringify({id:col._id});
            res.end(idRoom);
        }
    })
}
router.route('/').get((req,res,next)=>{
    mongoClien.connect(urlDb,(err,db)=>{
        if (err) throw err;
        var collection = db.collection('users');
        collection.findOne({_id:global.userID},(err,col)=>{
            if (err) throw err;
            if(col.rooms != null) {
                renderRoom(col,res,db,col.rooms.length);
            } else {
                resRenderRoom(col,res,undefined)
            }
        });
    });
}).post((req,res,next)=>{
    var body = req.read();
    body = JSON.parse(body);
    var userID = global.userID;
    mongoClien.connect(urlDb,(err,db)=>{
        var collection = db.collection('room');
        collection.findOne({friendID:userID, userNick:body.nickFriend},(err,col)=>{
            if (err) throw err;
            if (col == null){
                seachRoom (db,collection,body,res,userID);
            } else {
                idRoom = JSON.stringify({id:col._id});
                res.end(idRoom);
            }
        })
    });
});

module.exports = router;
