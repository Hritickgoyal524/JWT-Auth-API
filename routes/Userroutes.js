import express from 'express';

const router=express.Router()
import UserController from '../controllers/Usercontroller.js';
import checkauth from '../middleware/auth-middleware.js';
//route level middleware
router.use('/changepassword',checkauth)//first checkauth will run then next fucntion call changepassword function
router.use("/loggeduser",checkauth)

//public route
router.post('/register',UserController.userRegistration)
router.post('/login',UserController.userLogin)
router.post('/send-reset-password-email',UserController.Resetpasswordemail)
router.post('/reset_password/:id/:token',UserController.passwordreset)
//protected route
router.get("/loggeduser",UserController.detaillogineduser)
router.post('/changepassword',UserController.changepassword)
export default router;