var mongoClient = require("mongodb").MongoClient;
var url = require("url");
var cookieParser = require("cookie-parser");
var urlDb = 'mongodb://127.0.0.1:27017/ray';
module.exports = (app)=>{
    app.use((req,res,next)=>{
        mongoClient.connect(urlDb, (err,db)=>{
            if (err) throw err;
            var collection = db.collection("users");
            collection.findOne({_id:global.userID},(err,col)=>{
                if (err) throw err;
                if (col == null) {
                    next();
                    return;
                }
                var cookies = cookieParser(req);
                res.cookie("user",{
                    nick:col.nick,
                    name: col.name,
                    surname: col.surname,
                    maxAge:null
                });
                next();
            })
        })
    })
}