var mongoClient = require("mongodb").MongoClient;
var url = require("url");
var mongoose = require('mongoose');
var urlDb = 'mongodb://127.0.0.1:27017/ray';
var clients = [];
// Сделать проверки на существование документов в DB
function parsUrl(urlRoom){
    var urlHead = new String,urlId = new String;
    for(var i=0,ok; i<urlRoom.length;i++){
        if (urlRoom[i] == "?") {
            ok = true;
            i++;
        }
        if (ok != true) {
            urlHead += urlRoom[i];
        } else {
            urlId += urlRoom[i];
        }
    };
    return {
        urlHead:urlHead,
        urlId:urlId
    }
} 
function seachUser(res,colRoom){
    mongoClient.connect(urlDb,(err,db)=>{
        if (err) throw res.end("not found error 404");
        var collection = db.collection("users");
        collection.findOne({_id:global.userID},(err,col)=>{
            if (err) throw err;
            try {
                var nick1,nick2;
                console.log(col.nick,colRoom.friendNick);
                if( col.nick == colRoom.friendNick){
                    nick1 = colRoom.friendNick;
                    nick2 = colRoom.userNick;
                }  else {
                    nick2 = colRoom.friendNick;
                    nick1 = col.nick;
                }
                    res.render("room",{
                        name: col.name,
                        surname:col.surname,
                        nick:nick1,
                        nickFriend:nick2,
                        lengthMessages:colRoom.messages.length,
                        messages: colRoom.messages,
                    });
            } catch (err) {
                try {
                    var nick1,nick2;
                    console.log(col.nick,colRoom.friendNick);
                    if( col.nick == colRoom.friendNick){
                        nick1 = colRoom.friendNick;
                        nick2 = colRoom.userNick;
                    }  else {
                        nick2 = colRoom.friendNick;
                        nick1 = col.nick;
                    }
                    res.render("room",{
                        name: col.name,
                        surname:col.surname,
                        nick:nick1,
                        nickFriend:nick2,
                        messages: colRoom.messages,
                    });
                } catch(err) {
                    res.end("Fatality error");
                    return err;
                }
            }
        });
        db.close();
    });
}

module.exports = (app)=>{
    //Отправка шаблона с данными 
    app.use((req,res,next)=>{
        var urlRoom = req.url;
        var urlHead = parsUrl(urlRoom).urlHead,
        urlId = parsUrl(urlRoom).urlId;
        console.log(urlHead, urlId);
        if (urlHead == "/room") {
            if (urlId.length != 24) {
                return res.end("error url");
            }else {
                try {
                    urlId = new mongoose.Types.ObjectId(urlId);
                    mongoClient.connect(urlDb,(err,db)=>{
                        if (err) throw res.end("not found error 404");
                        var collection = db.collection("room");
                        collection.findOne({_id:urlId},(err,col)=>{
                            // console.log(col);
                            if (err) throw err;
                            console.log(col);
                            seachUser(res,col);
                            db.close();
                        });
                    });
                }catch (err){
                    return err;
                }
            }
        } else next();
    });
    // Get обработчик get запросов
    app.use((req,res,next)=>{
        var urlRoom = req.url;
        var urlHead = parsUrl(urlRoom).urlHead,
        urlId = parsUrl(urlRoom).urlId;
        if(urlHead == "/sign") {
        } else next();
})}