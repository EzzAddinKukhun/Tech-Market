const express = require("express");
const multer = require("multer");
const path = require("path");
const productsRouter = express.Router();
productsRouter.use(express.json())
const productsController = require("../Controllers/ProductsController");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "ProductsImgs");
    },
    filename: (req, file, callback) => {
      callback(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  const uploadProductPhoto = multer({
    storage: storage,
  });

  productsRouter.post("/addNewProduct", uploadProductPhoto.single("productImage"), productsController.addNewProduct); 
  productsRouter.get("/product/:id", productsController.getProductById); 
  productsRouter.put("/updateProduct/:id", productsController.updateProductData); 
  productsRouter.put("/updateProductImage/:id", uploadProductPhoto.single("productImage"), productsController.updateProductImage); 
  productsRouter.delete("/deleteProductImage/:id", productsController.deleteProductImage); 

  module.exports = productsRouter; 
