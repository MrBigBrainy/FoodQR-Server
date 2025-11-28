import { log } from "console"; // อาจจะไม่จำเป็นต้องใช้
import foodModel from "../models/foodModels";
import fs from 'fs' // ใช้สำหรับลบไฟล์รูปภาพเมื่อลบสินค้า

// add food item
const addFood = async (req, res) => {

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });
    try {
        await food.save();
        res.json({success: true, message: "Food Added"});
    } catch (error){
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({}); 
        res.json({success: true, data: foods});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}
// remove food item
const removeFood = async (req,res) => {
    try{
        const food = await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModael.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Foof Removed"})
    }catch (error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }
}

export { addFood, listFood,removeFood }