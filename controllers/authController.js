import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import UserModel from "../models/UserModel.js";

import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
export const registerController = async(req,res)=>{
    try {
        
        const {name,email,password,phone,address,question} = req.body;
        if(!name){
            return res.send({message:"name is required"})
        }
        if(!email){
            return res.send({message:"email is required"})
        }
        if(!password){
            return res.send({message:"password is required jaroori"})
        }
        if(!phone){
            return res.send({message:"phone is required"})
        }
        if(!address){
            return res.send({error:"address is required"})
        }
        if(!question){
            return res.send({error:"question is required"})
        }
        const existuser= await UserModel.findOne({email})
        if(existuser){
            return res.status(200).send({
                success:false,
                message:"Already registered",
                
            })
        }

        const hashedPassword = await hashPassword(password)
        const user1  =await new UserModel({name,email,password: hashedPassword,phone,address,question}).save()
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user:user1
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in registration",
            error
        })
    }
}


export const loginController = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email not registered"
            })
        }
        const matched = await comparePassword(password,user.password)
        if(!matched){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }

        const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:'7d'
        })
        res.status(200).send({
            success:true,
            message:"login successfully",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,

            },
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error

        })
    }
}


export const forgotPasswordController=async(req,res)=>{
try {
    const {email,question,newPassword} = req.body;
    if(!email){
        res.status(400).send({message:"Email is required"})
    }
    if(!question){
        res.status(400).send({message:"quesion is required"})
    }
    if(!newPassword){
        res.status(400).send({message:"New Password is required"})
    }

    const user = await UserModel.findOne({email,question})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"Wrong email or question"
        })
    }
    const hashed = await hashPassword(newPassword);
    await UserModel.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
        success:true,
        message:"password reset successfully"
    })

} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Something went wrong",
        error
    })
}
}


export const testController = (req,res)=>{
    res.send("hello")
}


export const updateProfileController=  async(req,res)=>{
    try {
        const {name,email,password,address,phone} = req.body
        const user = await UserModel.findById(req.user._id)

        if(password){
            return res.json({error:"password is required"})
        }
        const hashPassword=  password ? await hashPassword(password) : undefined
        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id,{
            name:name||user.name,
            password:hashPassword|| user.password,
            phone:phone|| user.phone,
            address:address|| user.address,


        },{new:true})
        res.status(200).send({
            success:true,
            message:"profile updated ",
            updatedUser
        })

    } catch (error) {
        console.log(error)
    res.status(400).send({
        success:false,
        message:"Something went wrong in updating profile",
        error
    })
    }
}




export const getOrderController = async(req,res)=>{
    try {
        
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong in getting orders",
            error
        })
    }
}



export const getAllOrderController = async(req,res)=>{
    try {
        
        const orders = await orderModel.find().populate("products","-photo").populate("buyer","name")
        .sort({createdAt:"-1"})
        res.json(orders)

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong in getting orders",
            error
        })
    }
}



export const orderStatusController = async(req,res)=>{
    try {
        
        const {orderId} = req.params
        const {status} = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Something went wrong in updating Status",
            error
        })
    }
}