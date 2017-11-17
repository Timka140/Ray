var newUserDb = require('../dbSheam/userShem.js').userInfoDB;
var sheamUserDb = require('../dbSheam/userShem.js').modUser;
module.exports = (nick,name,surname,email,password,dateUser) => {
    console.log("Работает");
    newUserDb(nick,name,surname,email,password,dateUser);
};