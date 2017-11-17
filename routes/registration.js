var express = require('express');
var router = express.Router();

var sheamUserDb = require('../dbSheam/userShem.js').modUser;
var User = require("../User/newUser.js");
var  errInp;

/* GET users listing. */
router.route('/')
  .get(function(req, res, next) {
    res.render('registration', {errInp: errInp});
    errInp = undefined;
  })
  .post((req,res,next) => {
    var nick = req.body.nick,
        name = req.body.name,
        surname = req.body.surname,
        email = req.body.email,
        email2 = req.body.confirmEmail,
        password = req.body.password,
        password2 = req.body.confirmPass,
        dateUser= req.body.Month;
        console.log(dateUser + " !1");
        function seachEmail() {
            sheamUserDb.findOne({email:email},function(err,sheamUserDb){
                if (sheamUserDb == null) {
                User(nick,name,surname,email,password,dateUser);
                res.redirect('/login')
                return console.log('Ошибки нету пользователь добавлен');
            } else {
                errInp = 'Email already exists';
                res.redirect('/registration');
                return
                }
            });
        }

    if (name == ''  || surname.length == '' || email == '' || email2 == '' || password == '' || password2 == '' || dateUser == '') {
        errInp = 'Field is empty';
        res.redirect('/registration');
    } else if (password !=password2 || password.length < 8 ) {
        errInp = 'Password does not match or is less than 8 characters';
        res.redirect('/registration');
    } else if (email !=email2) {
        errInp = 'Mail mismatch';
        res.redirect('/registration');
    } else if (dateUser[0] > 31 || dateUser[1] > 12 || dateUser[2].length < 4 || dateUser.length > 4) {
         errInp = 'Date error';
         console.log(dateUser);
         res.redirect('/registration');
    } else if (!(dateUser[0].match(/[0-9]/g) || dateUser[1].match(/[0-9]/g) || dateUser[2].match(/[0-9]/g)))  {
        errInp = 'Date error';
         console.log(dateUser);
         res.redirect('/registration');
    }else{
              sheamUserDb.findOne({nick:nick},function(err,sheamUserDb){
              if (err) return next(err);
              if (sheamUserDb == null) {
                  seachEmail();
              return
          } else {
              errInp = 'Nick already exists';
              res.redirect('/registration');
              return console.log('Ник занят');
              }
          });
    };
    console.log(nick,name,surname,email,email2,password,password2,dateUser)
  });

module.exports = router;