import express from "express"
import {isAdmin, requireSignIn} from "./../middlewares/authmiddleware.js"
import { categoryController, createCategoryController, deleteCategoryController, getSingleCategory, updateCategoryControler } from "../controllers/categoryController.js"


const router = express.Router()

router.post("/create-category",requireSignIn,isAdmin,createCategoryController)
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryControler)
router.get("/get-category",categoryController)
router.get('/single-category/:slug',getSingleCategory)
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)

export default router