const express = require ('express');
require('dotenv').config();  
const app = express (); 
const PORT = 8000;
const userRoute = require ('./routes/User');
const webRouter = require ('./routes/webRouter'); 

const cors = require('cors'); 
app.use(cors()); 
app.use('/user', userRoute); 
app.use ('/', webRouter);
app.use("/ProfilePicture", express.static('PersonalImgs'));
// app.use(express.static(__dirname + '/PersonalImgs'));

console.log (__dirname)

app.listen (PORT, ()=>{
    console.log ("server is running!");
}) 



