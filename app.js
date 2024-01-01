const express = require ('express'); 
const app = express (); 
const PORT = 8000;
const userRoute = require ('./routes/User');
const cors = require('cors'); 
app.use(cors()); 
app.use('/user', userRoute); 
app.use("/ProfilePicture", express.static('PersonalImgs'));
// app.use(express.static(__dirname + '/PersonalImgs'));

console.log (__dirname)

app.listen (PORT, ()=>{
    console.log ("server is running!");
}) 



