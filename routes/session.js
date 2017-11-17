var url = require('url');
var cookiePars = require('../User/cookiePars');

module.exports = (app) => {
    app.use((req,res,next)=>{
        cookiePars(req.cookies,req,res,next);
    });
}