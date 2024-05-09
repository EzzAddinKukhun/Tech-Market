const express = require("express");
const adminRouter = express.Router();
adminRouter.use(express.json())
const adminController = require("../Controllers/AdminController");


adminRouter.get("/users", adminController.getStoreUsers); 
adminRouter.get("/users/:id", adminController.getUserInformation)


module.exports = adminRouter


