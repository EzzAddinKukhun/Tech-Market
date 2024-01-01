const express = require("express");
const bcrypt = require("bcrypt");
const multer = require('multer'); 
const path = require('path'); 
const fs = require('fs');
const router = express.Router();
const connection = require("../DbConnection");
router.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'PersonalImgs')
    },   
    filename: (req, file, callback)=>{
        callback(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))

    }
})

const upload = multer ({
    storage: storage, 

})

router.post("/signup", (req, res) => {
  try {
    const {
      firstName,
      midName,
      lastName,
      birthdate,
      phoneNumber,
      country,
      city,
      address,
      profilePhoto,
      username,
      password,
      email,
      bankId = 0,
      creditCardNumber = 0,
      isBlocked = false,
      isVerified = false,
    } = req.body;

    connection.query("select email, username from users", async (err, rows) => {
      const person = rows.find((person) => (email == person.email) || (username == person.username));
      if (person != undefined) return res.status(400).send({message: "There is an error in email or username, try to enter another one"}); 

      const hashedPassword = await bcrypt.hash(password, 10); 

      const addNewUserStatement =
        "insert into users (`userId`,`firstName`,`midName`,`lastName`,`birthdate`,`phoneNumber`," +
        "`country`,`city`,`address`,`profilePhoto`,`username`,`password`,`email`,`bankId`,`creditCardNumber`,`isBlocked`,`isVerified`) VALUES (?)";

      const values = [
        0,
        firstName,
        midName,
        lastName,
        birthdate,
        phoneNumber,
        country,
        city,
        address,
        "",
        username,
        hashedPassword,
        email,
        0,
        0,
        false,
        false,
      ];
      connection.query(addNewUserStatement, [values], (err) => {
        if (err) res.status(404).send({ message: "failed" });
        else res.status(200).send({ message: "success" });
      });
    });
  } catch (err) {
    res.status(500).send({ message: "There is an error!" });
  }
});

router.post ('/login', (req, res)=>{
    try{
        const {username, password} = req.body;
        connection.query(`select username, password from users where username='${username}'`,  async (err, rows)=>{
            if (rows.length == 0) return res.status(400).send({message: "This is an invalid username!"}); 
            const isPasswordsMatched = await bcrypt.compare(password, rows[0].password);
            isPasswordsMatched? res.status(200).send({message: 'success'}) : res.status(400).send({message: 'failed'})
        });
    }
    catch (err) {
        console.log (err)
    }
}); 


router.post ('/uploadPersonalPhoto', upload.single('personalImg'), (req, res)=> {
    const userId = req.body.userId; 
    const photoName = req.file.filename; 
    const getProfilePhotoNameQuery = `select profilePhoto from users where userId='${userId}'`
    connection.query(getProfilePhotoNameQuery , (err, rows)=>{
        if (rows[0].profilePhoto != ""){
            fs.unlinkSync(`./PersonalImgs/${rows[0].profilePhoto}`); 
        }
    })
    const uploadProfilePhotoQuery = `update users set profilePhoto ='${photoName}' where userId='${userId}'`
    connection.query(uploadProfilePhotoQuery, (err)=>{
        try{
            return res.status(200).send("success"); 

        }
        catch (err){
            return res.status(500).send("failed"); 
        }
    })
}); 


module.exports = router;
