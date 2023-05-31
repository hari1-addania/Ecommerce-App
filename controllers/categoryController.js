import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";
export const createCategoryController = async(req,res)=>{
try {
    const {name} = req.body
    if(!name){
        return res.status(401).send({
            message:'Name is required'
        })
    }
    const ExistingCategory = await CategoryModel.findOne({name})

    if(ExistingCategory){
        return res.status(200).send({
            success:true,
            message:"Category Already Exists"
        })
    }
    const category  = await new CategoryModel({
        name,
        slug:slugify(name)
    }).save()
    res.status(201).send({
        success:true,
        message:"new category added",
        category
    })
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:"error in category"
    })
}
}

export const updateCategoryControler=async(req,res)=>{

    try {
        const {name}= req.body
        const {id} = req.params
        const category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"category updated successgully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while updating category"
        })
    }
}

export const categoryController=async(req,res)=>{
    try {
        const category = await CategoryModel.find();
        res.status(200).send({
            success:true,
            message:"all category list",
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error while gettign categories"
        })
    }

}

export const getSingleCategory = async(req,res)=>{
    try {
        
        const category = await CategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"get single category seccess",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while gettign single category"
        })
    }

    }


    export const deleteCategoryController=async(req,res)=>{
        try {
            const {id} = req.params
            await CategoryModel.findByIdAndDelete(id)
            res.status(200).send({
                success:true,
                message:"deleted single category seccess",
                
            })
        } catch (error) {
            console.log(error);
        res.status(500).send({
            success:false,
            message:"error while deleting single category",
            error
        })
        }
    }