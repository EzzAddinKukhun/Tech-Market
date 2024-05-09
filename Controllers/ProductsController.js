const connection = require("../DbConnection");
const fs = require("fs");

const addNewProduct = (req, res) => {
    try {
      const {
        productName,
        productCategory,
        productCurrency,
        productBasePrice,
        productPrice,
        productQuantity,
        productDescription,
      } = req.body;
      const productImage = req.file.filename;

      console.log(productName)
         
      const addNewProductQuery =
        "insert into products (`productId`,`productName`,`productImage`,`productCategory`,`productCurrency`,`productBasePrice`," +
        "`productPrice`,`productQuantity`,`productDescription`) VALUES (?)";
  
      const values = [
        0,
        productName,
        productImage,
        productCategory,
        productCurrency,
        productBasePrice,
        productPrice,
        productQuantity,
        productDescription,
      ];
  
      connection.query(addNewProductQuery, [values], (err) => {
        return res.status(200).send({ message: "success" });
      });
    } catch (err) {
      return res.status(500).send({ message: "data base failed" });
    }
  };


  module.exports = {
    addNewProduct
  }