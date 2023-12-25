const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const connection = require("../DbConnection");
router.use(express.json());

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

    connection.query("select email, username from users", (err, rows) => {
      const person = rows.find((person) => (email == person.email) || (username == person.username));
      if (person != undefined) return res.status(400).send({message: "There is an error in email or username, try to enter another one"}); 

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
        password,
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

module.exports = router;
