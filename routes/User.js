const express = require("express");
const multer = require("multer");
const userRouter = express.Router();
userRouter.use(express.json());
const userController = require("../Controllers/UserController")

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "PersonalImgs");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const uploadProfilePhoto = multer({
  storage: storage,
});


userRouter.post("/signup", userController.userSignUp);
userRouter.post("/login", userController.userLogIn);
userRouter.post("/uploadPersonalPhoto", uploadProfilePhoto.single("personalImg"), userController.uploadUserPersonalImg);
userRouter.get("/userInformation/:id", userController.getUserInformation);
userRouter.get("/forgetPassword", userController.forgotPassword);
userRouter.post("/changePassword", userController.updatePassword)

module.exports = userRouter;
