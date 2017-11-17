var mongoClient = require("mongodb").MongoClient;
var url = require("url");
var urlDb = 'mongodb://127.0.0.1:27017/ray';
var messages = require("./messages");
var room = require("./room");
var mongoose = require('mongoose');
//Возвращает undefined надо исправить
class normRoom {
  constructor (idUser,idRoom){
    this.idUser = idUser;
    this.idRoom = idRoom;
  }
  norm() {
    //Написать функцию обработки повторяющихся id комнат
    mongoClient.connect(urlDb,(err,db)=>{
      if (err) throw err;
      var collection = db.collection("users");
      collection.findOne({_id:this.idUser},(err,col)=>{
        if (err) throw err;
        var rooms = col.rooms;
        if(rooms == null) {
          console.log("Условие 2");
          return;
        } else {
          console.log("Условие 1");
          for(var i=0; i<col.rooms.lenght; i++){
            if(col.rooms[i] != idRoom) rooms.pusch(idRoom);
          }
          collectionUsers.update({_id:this.idUser}, {$set:{rooms:rooms}});
        }
      });
    });
  }
}
function roomArr(db,user,friend,idRoom){
  var collectionUsers = db.collection("users");

  var normUser = new normRoom(user,idRoom,true);
  var normFriend = new normRoom(friend,idRoom,false);
  console.log(idRoom," Перед вызовом объекта");
  // collectionUsers.update({_id:user}, {$set:{rooms:normUser.norm()}});
  // collectionUsers.update({_id:friend}, {$set:{rooms:normFriend.norm()}});
  collectionUsers.update({_id:user}, {$push:{rooms:idRoom}});
  collectionUsers.update({_id:friend}, {$push:{rooms:idRoom}});
}

module.exports = (app)=>{
    var http = require('http').Server(app);
    var io = require("socket.io")(http);
    http.listen(80);
    room(app);
    app.use('/messages',messages);
    //Переделать чат
    io.of("/rooms").on('connection', function (socket) {
        socket.on("new message", function (data) {
          // we tell the client to execute 'new message'
          socket.broadcast.emit(data.idRoom, {
            username: socket.username,
            message: data
          });
          mongoClient.connect(urlDb,(err,db)=>{
            if (err) throw err;
            var urlId = new mongoose.Types.ObjectId(data.idRoom);
            var collection = db.collection("room");
            collection.update({_id: urlId}, {$push:{messages:data}});

            collection.findOne({_id:urlId},((err,col)=>{
              if (err) throw err;
              roomArr(db,col.userID,col.friendID,urlId);
            }));
          });
        });
      });      
}