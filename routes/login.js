var express = require('express');
var router = express.Router();

var mongoClient = require("mongodb").MongoClient;
var sheamUserDb = require('../dbSheam/userShem.js').modUser;
var errInp;

function tokenKod () {
    var tokenHash = Math.random(1,100000000);
    console.log(tokenHash);
    tokenHash = tokenHash.toString(16);
    return tokenHash;
}
function upDateUser(token,id) {
    //sheamUserDb.update({_id:id},{$set: {token:token}});
    var url = 'mongodb://127.0.0.1:27017/ray';
    mongoClient.connect(url,(err,db)=> {
        var collection = db.collection("users");
        var user = {_id:id};

        collection.update(user, {$set: {token:token}});
        db.close();
    })
    console.log(token,id);
}

/* GET users listing. */
router.route("/").get((req, res, next) =>{
  res.render('login', { 
      title: 'Express',
      errInp: errInp
     });
    errInp = '';
}).post((req,res,next)=> {
    var email = req.body.email,
        password = req.body.pass;

        if (email == "" || password == "") {
            errInp = "Username or password is empty";
            res.redirect("/login");
        } else {
            var hash = require('../User/hash.js')(password);

            sheamUserDb.findOne({email:email, password:hash}, (err,sheamUserDb)=> {
                if (err) throw console.log(err);
                if (sheamUserDb == null || undefined) {
                    errInp= "Login or password is incorrect";
                    res.redirect("/login");
                } else {
                    var token = tokenKod();
                    req.session.user = token;
                    upDateUser(token,sheamUserDb._id);
                    res.redirect("/");
                }
            });
        }
});

module.exports = router;