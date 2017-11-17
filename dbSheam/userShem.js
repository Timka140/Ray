var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://127.0.0.1:27017/ray');

// //Registr users shema

// Friends Queue -> FriQue

var modUser = mongoose.model('users', {
  nick: String,
  name: String,
  surname: String,
  email: String,
  password: String,
  month: ['month'],
  status: Boolean,
  token: String,
  rooms: Array,
  friends: Array,
  licks: Array
});



function userInfoDB(nick,name,surname,email,password,month){
var hash = require('../User/hash.js')(password);
password = hash;
var mode = new modUser({ 
  nick:nick,
  name:name,
  surname: surname,
  email:email,
  password: password,
  month: month,
 });
mode.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});
}

module.exports = {
  userInfoDB: userInfoDB,
  modUser:modUser,
};
