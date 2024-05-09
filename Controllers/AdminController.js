const connection = require("../DbConnection");
const fs = require("fs");

const getStoreUsers = (req, res) => {
  try {
    const getUsersQuery = "SELECT * from users";
    connection.query(getUsersQuery, async (err, rows) => {
      return res.status(200).send({
        message: "success",
        users: rows,
      });
    });
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
};

const getUserInformation = (req, res) => {
  try {
    const userId = req.params.id;
    const getUserQuery = `SELECT * from users where userId=${userId}`;
    connection.query(getUserQuery, async (err, rows) => {
      if (rows.length === 0)
        return res.status(200).send({
          message: "success/nodata",
        });
      else
        return res.status(200).send({
          message: "success",
          user: rows[0],
        });
    });
  } catch (err) {
    return res.status(500).send({ message: "failed" });
  }
};



module.exports = {
  getStoreUsers,
  getUserInformation,
};
