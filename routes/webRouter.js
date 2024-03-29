const express = require('express'); 
const userRouter = express(); 
const connection = require("../DbConnection");

userRouter.set ('view engine', 'ejs'); 
userRouter.set ('views', './views'); 


userRouter.get ('/mail-verification', (req, res) => {
    const token = req.query.token;
    connection.query ('SELECT * from users where token=? ', token, (err, result, fields)=> {
        if (result.length > 0){
            connection.query (`UPDATE users set token=null, isVerified=1 where userId = '${result[0].userId}'`); 
            return res.render ('mail-verification', {message: 'Mail Verified Successfully!'})
        }
    })
}); 


userRouter.get ('/change-password', (req, res) => {
    const username = req.query.username;
    return res.render ('change-password', {message: "TTT"})    
}); 

module.exports = userRouter; 