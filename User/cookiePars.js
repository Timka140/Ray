var cookieParser = require('cookie-parser');
var mongo = require('mongodb');
var mongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');



var url = 'mongodb://127.0.0.1:27017/ray';

function seachUserId (userToken,next,res) {
    mongoClient.connect(url, (err,db)=> {
        var collection = db.collection("users");
        var user = {token:userToken};
        
        collection.findOne(user, (err,result)=>{
            if (err) throw console.log(err);
            db.close();
            if(result == null){
                res.redirect("/registration");
                return;
            } 
            global.userID = result._id;
            next();
        });
    });
}

module.exports = (cookie,req,res,next)=> {
    var cookieID = cookieParser.signedCookies(cookie, "xl2k6sp91cda");
    mongoClient.connect(url, (err,db)=> {
        var collection = db.collection("sessions");
        var user = {_id:cookieID.sid};

        collection.findOne(user, (err,result)=> {
            // if (err) throw console.log(err);
            if (result == null) {
                if (req.url == "/login" || req.url == "/" || req.url == "/registration") {
                    next();
                } else {
                    res.redirect("/login");
                }
            } else {
                var userToken = result.session;
                    userToken = JSON.parse(userToken);
                    if (req.url == "/login" || req.url == "/" || req.url == "/registration"){
                        next();
                    } else {
                        if (userToken.user != undefined) {
                            seachUserId (userToken.user,next,res);
                        } else {
                            res.redirect("/login");
                        }
                    }
            }
            db.close();
        });
    });
}