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


  const getProductById = (req, res) =>{
    try{
      const productId = req.params.id; 
      const getProductByIdQuery = `SELECT * FROM PRODUCTS WHERE productId='${productId}'`; 
      connection.query(getProductByIdQuery, async (err, rows) =>{
        if (rows[0] === undefined) return res.status(204).send();
        else return res.status(200).send({ message: "success",
          productData: rows[0]
         });

      } )
    }
    catch (err) {
      return res.status(500).send({ message: "data base failed" });
    }
  }


  const updateProductData = (req, res) => {
    try{
      let emptyUpdateProductQuery = `UPDATE PRODUCTS SET `;
      let fullUpdateProductQuery = ""; 
      const productId = req.params.id; 
      for (let key in req.body) {
        emptyUpdateProductQuery =`${emptyUpdateProductQuery}${key}='${req.body[key]}',`;

      }
      fullUpdateProductQuery = emptyUpdateProductQuery.slice(0, -1); 
      fullUpdateProductQuery += ` where productId='${productId}'`; 
      
      connection.query(fullUpdateProductQuery, (err)=>{
        return res.status(200).send({ message: "success"});
      })
    }
    catch (err) {
      return res.status(500).send({ message: "server_error"});
    }
  }


  module.exports = {
    addNewProduct,
    getProductById,
    updateProductData
  }