import mongoose from "mongoose";
//define schema
const userschema=mongoose.Schema({
name:{type:String,required:true,trim:true},
email:{type:String,required:true,trim:true},
password:{type:String,required:true,trim:true},
tc:{type:Boolean,required:true},
})

//creating model
const Usermodel=mongoose.model("user",userschema)//user is collection
export default Usermodel;