var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1:27017/ray';

module.exports = (template,title,req,res) => {
        if (global.userID == undefined || global.userID == null) {
        res.redirect('/login')
    } else {
            mongoClient.connect(url, (err,db)=> {
            var collection = db.collection("users");
            var user = {_id:global.userID};
            
            collection.findOne(user, (err,result)=>{
                if (err) throw console.log(err);
                res.render(template,{
                    title: title,
                    nick: result.nick,
                    name: result.name,
                    surname: result.surname,
                    email: result.email,
                    day:result.month[0],
                    month: result.month[1],
                    year: result.month[2],
                    status: result.status,
                    createNews: true,
                });     
            });
        });
    }
}