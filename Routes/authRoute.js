import  express  from "express";
import {registerController,loginController,testController,forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";

const router = express.Router()


router.post("/register",registerController)
router.post("/login",loginController)

router.get("/login", requireSignIn ,isAdmin,testController)

router.post("/forgot-password",forgotPasswordController)

//protected route
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})


router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

router.put("/profile",requireSignIn,updateProfileController)

router.get("/orders",requireSignIn,getOrderController)

router.get("/all-orders",requireSignIn,isAdmin ,getAllOrderController)

router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController)


export default router;
