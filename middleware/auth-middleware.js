import jwt from "jsonwebtoken";
// 
import Usermodel  from "../models/User.js";
let checkauth=async(req,res,next)=>{
    let token;
    const {authorization}=req.headers;//in headers authorization is the key for token so we are accesing them
if(authorization&&authorization.startsWith('Bearer')){//we are checking we authorization starts with bearer or not because in front end we pass json token with the help of bearer
try{
     token=authorization.split(' ')[1];//getting token from header
   
     //verify token that user passed valid token or not
     const {userID}=jwt.verify(token,process.env.JWT_SECRET_KEY)
     // get user from token USermodel
     req.user=await Usermodel.findById(userID).select('-password')//.select(-pass)is used to get all data just leave password
    
     next()
}
catch(error){
    console.log(error)
    res.status(401).send({"status":"failed","message":"Unauthorized User"})
}
}
if(!token){
    res.status(401).send({"status":"failed","message":"Unauthorized User, No Token"})
}
}
export default checkauth
