const bcrypt = require("bcrypt");
const path = require("path");
const randomstring = require("randomstring");
const sendMail = require("../utils/sendEmail");
const fs = require("fs");
const connection = require("../DbConnection");
const { env } = require("process");



const userSignUp = (req, res) => {
    try {
      const {
        firstName,
        midName,
        lastName,
        birthDate,
        phoneNumber,
        country,
        city,
        address,
        username,
        password,
        email,
      } = req.body;
  
      connection.query("select email from users", async (err, rows) => {
        const person = rows.find(
          (person) => email == person.email
        );
        if (person != undefined){
          console.log(person);
          return res.status(400).send({
            message:
              "This Account has already registered!",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const addNewUserStatement =
          "insert into users (`userId`,`firstName`,`midName`,`lastName`,`birthdate`,`phoneNumber`," +
          "`country`,`city`,`address`,`profilePhoto`,`username`,`password`,`email`,`bankId`,`creditCardNumber`,`isBlocked`,`token`,`isVerified`) VALUES (?)";
  
        const values = [
          0,
          firstName,
          midName,
          lastName,
          birthDate,
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
          "",
          0,
        ];
        console.log (values)
        connection.query(addNewUserStatement, [values], (err) => {
          if (err) {res.status(404).send({ message: "failed" });}
          else {
            const mailSubject = "Mail Verification!";
            const randomToken = randomstring.generate();
            const content = `<p> Hi ${firstName + lastName}, Please <a href="${
              process.env.BASE_URL
            }/mail-verification?token=${randomToken}">Verify</a> your mail! `;
            sendMail(email, mailSubject, content);
            connection.query("UPDATE users set token=? where email=?", [
              randomToken,
              email,
            ]);
            res.status(200).send({ message: "success" });
          }
        });
      });


    } catch (err) {
      res.status(500).send({ message: "There is an error!" });
    }
}


const userLogIn = (req, res) => {
    try {
      const { username, password } = req.body;
      connection.query(
        `select * from users where username='${username}'`,
        async (err, rows) => {
          if (rows.length == 0){
            return res
            .status(400)
            .send({ message: "This is an invalid username!" });
          }

          if (!rows[0].isVerified){return res.status(500).send({message: "Account is not verified!"})}
           
          const isPasswordsMatched = await bcrypt.compare(
            password,
            rows[0].password
          );
          isPasswordsMatched
            ? res.status(200).send({ message: "success" })
            : res.status(400).send({ message: "wrong password" });
        }
      );
    } catch (err) {
      console.log(err);
    }
}

const uploadUserPersonalImg = (req, res) => {
    const userId = req.body.userId;
    const photoName = req.file.filename;
    const getProfilePhotoNameQuery = `select profilePhoto from users where userId='${userId}'`;
    connection.query(getProfilePhotoNameQuery, (err, rows) => {
      if (rows[0].profilePhoto != "") {
        fs.unlinkSync(`./PersonalImgs/${rows[0].profilePhoto}`);
      }
    });
    const uploadProfilePhotoQuery = `update users set profilePhoto ='${photoName}' where userId='${userId}'`;
    connection.query(uploadProfilePhotoQuery, (err) => {
      try {
        return res.status(200).send("success");
      } catch (err) {
        return res.status(500).send("failed");
      }
    });
  }

const getUserInformation = (req, res) => {
    const userId = req.params.id;
    const getUserInformationQuery = `select * from users where userId='${userId}'`;
    connection.query(getUserInformationQuery, (err, rows) => {
      try {
        if (rows.length == 0) {
          return res.status(400).send("This User Doesn't exist!");
        } else {
          return res.status(200).send(rows[0]);
        }
      } catch (err) {
        return res.status(500).send("Error!");
      }
    });
  }

const forgotPassword = (req, res) => {
    const username = req.body.username;
    connection.query(
      `SELECT firstName, lastName, email from users where username='${username}'`,
      (err, rows) => {
        if (rows.length == 0) {
          return res.status(404).send({ message: "failed" });
        } else {
          const mailSubject = "Change Your Password!";
          const content = `<p> Hi ${rows[0].firstName + rows[0].lastName}, Please <a href="${
            process.env.BASE_URL
          }/change-password?username=${username}">Change Password Now!</a> your mail! `;
          sendMail(rows[0].email, mailSubject, content);
          res.status(200).send({ message: "success" });
        }
      }
    );
  }

const updatePassword = async (req, res)=>{
    const {username, password} = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10);
    connection.query(`Update users set password='${hashedPassword}' where username='${username}'`, (err)=>{
      if (err){
        return res.status(500).send({ message: "it seems that an error occured!" });
      }
      else {
        return res.status(200).send({ message: "Password Updated Successfully, Try to Login!" });
      }
    })



}


module.exports = {
    userSignUp,
    userLogIn,
    uploadUserPersonalImg,
    forgotPassword,
    updatePassword, 
    getUserInformation
}
