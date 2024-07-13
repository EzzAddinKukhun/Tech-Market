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

    console.log(productName);

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

const getProductById = (req, res) => {
  try {
    const productId = req.params.id;
    const getProductByIdQuery = `SELECT * FROM PRODUCTS WHERE productId='${productId}'`;
    connection.query(getProductByIdQuery, async (err, rows) => {
      if (rows[0] === undefined) return res.status(204).send();
      else
        return res
          .status(200)
          .send({ message: "success", productData: rows[0] });
    });
  } catch (err) {
    return res.status(500).send({ message: "data base failed" });
  }
};

const updateProductData = (req, res) => {
  try {
    let emptyUpdateProductQuery = `UPDATE PRODUCTS SET `;
    let fullUpdateProductQuery = "";
    const productId = req.params.id;
    for (let key in req.body) {
      emptyUpdateProductQuery = `${emptyUpdateProductQuery}${key}='${req.body[key]}',`;
    }
    fullUpdateProductQuery = emptyUpdateProductQuery.slice(0, -1);
    fullUpdateProductQuery += ` where productId='${productId}'`;

    connection.query(fullUpdateProductQuery, (err) => {
      return res.status(200).send({ message: "success" });
    });
  } catch (err) {
    return res.status(500).send({ message: "server_error" });
  }
};

const updateProductImage = (req, res) => {
  try {
    const fileName = req.file.filename;
    const productId = req.params.id;
    const getOldImageNameQuery = `SELECT productImage FROM PRODUCTS WHERE productId='${productId}'`;
    connection.query(getOldImageNameQuery, (err, rows) => {
      if (rows[0].productImage !== "") {
        fs.unlinkSync(`./ProductsImgs/${rows[0].productImage}`);
      }
      updateProductPhoto(fileName, productId, res); 
    });
  } catch (err) {
    fs.unlinkSync(`./ProductsImgs/${fileName}`); // delete the new uploaded photo if an issue occured in the server
    return res.status(500).send({ message: "Server issue occured!" });
  }
};


const deleteProductImage = (req, res) => {
  try{
    const productId = req.params.id; 
    const getProductImageQuery = `SELECT productImage FROM PRODUCTS WHERE productId='${productId}'`; 
    const deleteProductImageQuery = `UPDATE PRODUCTS SET productImage='' WHERE productId='${productId}'`; 
    connection.query(getProductImageQuery, (err, rows)=>{
      connection.query(deleteProductImageQuery, (err)=>{
        fs.unlinkSync(`./ProductsImgs/${rows[0].productImage}`);
        return res.status(200).send({message: "The image deleted successfully!"})
      })
    })
  }
  catch (err){
    return res.status(500).send({message: "Server issue!"})
  }
}

const updateProductPhoto = (fileName, productId, res) => {
  const updateProductImageNameQuery = `UPDATE PRODUCTS SET productImage='${fileName}' WHERE productId='${productId}'`;
  connection.query(updateProductImageNameQuery, (err) => {
    return res.status(200).send({ message: "Photo name updated!" });
  });
};



module.exports = {
  addNewProduct,
  getProductById,
  updateProductData,
  updateProductImage,
  deleteProductImage
};
